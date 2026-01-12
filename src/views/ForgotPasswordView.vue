<template>
  <div class="d-flex flex-column justify-center align-center h-100" style="min-height: 90vh">

    <v-card class="mx-auto" max-width="450" width="100%" elevation="10" rounded="lg">
      <v-card-title class="text-center pt-6 text-primary font-weight-bold">
        {{ step === 1 ? t('forgotPassword.title') : step === 2 ? t('forgotPassword.titleVerify') : t('forgotPassword.titleAlterPassword') }}
      </v-card-title>

      <v-card-text>
        <v-window v-model="step">
          <v-window-item :value="1">
            <div class="text-body-1 text-medium-emphasis text-center mb-6">
              {{ t('forgotPassword.stepEmail.instruction') }}
            </div>

            <v-form ref="formRef" @submit.prevent="handleSendCode">
              <v-text-field
                v-model="forgotForm.email"
                :rules="[rules.required(), rules.email()]"
                :label="t('forgotPassword.stepEmail.labelEmail')"
                :placeholder="t('forgotPassword.stepEmail.placeholderEmail')"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                :disabled="loading"
              />

              <v-btn
                block
                color="primary"
                size="large"
                type="submit"
                :loading="loading"
                class="mt-4"
              >
                {{ t('forgotPassword.stepEmail.btnSend') }}
              </v-btn>
            </v-form>
          </v-window-item>

          <v-window-item :value="2">
            <div class="text-body-2 text-center mb-6">
              {{ t('forgotPassword.stepVerify.instruction') }}<br>
              <strong>{{ forgotForm }}</strong>
            </div>

            <v-sheet color="transparent" class="mb-6">
              <v-otp-input
                v-model="otp"
                type="number"
                length="6"
                variant="outlined"
                color="primary"
                :disabled="loading"
                @finish="handleVerifyCode"
              ></v-otp-input>
            </v-sheet>

            <div class="text-center text-caption mb-6">
              <div v-if="timeLeft > 0">
                {{ t('forgotPassword.stepVerify.expiresIn') }}
                <span class="font-weight-bold text-error">{{ formattedTime }}</span>
              </div>
              <div v-else class="d-flex flex-column align-center gap-2">
                <span class="text-grey">{{ t('forgotPassword.stepVerify.expired') }}</span>
                <v-btn
                  variant="text"
                  color="secondary"
                  size="small"
                  :loading="loading"
                  @click="resendCode"
                >
                  {{ t('forgotPassword.stepVerify.btnResend') }}
                </v-btn>
              </div>
            </div>

            <v-btn
              block
              color="primary"
              size="large"
              @click="handleVerifyCode"
              :disabled="otp.length < 6"
              :loading="loading"
            >
              {{ t('forgotPassword.stepVerify.btnVerify') }}
            </v-btn>

            <v-btn
              variant="text"
              block
              class="mt-2"
              size="small"
              @click="changeEmail"
              :disabled="loading"
            >
              {{ t('forgotPassword.stepVerify.btnChangeEmail') }}
            </v-btn>
          </v-window-item>

          <v-window-item :value="3">
            <div class="text-body-1 text-medium-emphasis text-center mb-6">
              {{ t('forgotPassword.stepAlterPassword.instruction') }}
            </div>

            <v-form ref="formRef" @submit.prevent="handleAlterPassword">
              <v-text-field
                v-model="forgotForm.password"
                :rules="[rules.required(), rules.maxLength(20), rules.minLength(6)]"
                :label="t('forgotPassword.stepAlterPassword.labelNewPassword')"
                :placeholder="t('forgotPassword.stepAlterPassword.placeholderNewPassword')"
                :type="forgotForm.viewPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                :disabled="loading"
              >
                <template #append-inner>
                  <v-icon-btn
                    :icon="forgotForm.viewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="forgotForm.viewPassword = !forgotForm.viewPassword"
                    density="compact"
                    variant="text"
                  />
                </template>
              </v-text-field>

              <v-text-field
                v-model="forgotForm.confirmPassword"
                :rules="[rules.required(), rules.maxLength(20), rules.minLength(6)]"
                :label="t('forgotPassword.stepAlterPassword.labelConfirmPassword')"
                :placeholder="t('forgotPassword.stepAlterPassword.placeholderConfirmPassword')"
                :type="forgotForm.viewConfirmPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                :disabled="loading"
              >
                <template #append-inner>
                  <v-icon-btn
                    :icon="forgotForm.viewConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="forgotForm.viewConfirmPassword = !forgotForm.viewConfirmPassword"
                    density="compact"
                    variant="text"
                  />
                </template>
              </v-text-field>

              <v-btn
                block
                color="primary"
                size="large"
                type="submit"
                :loading="loading"
                class="mt-4"
              >
                {{ t('forgotPassword.stepAlterPassword.btnAlterPassword') }}
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/composables/useSnackbar';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';
import { ref, computed, onUnmounted } from 'vue';

const { t } = useI18n();
const { notify } = useSnackbar();
const rules = useRules();

const step = ref(1);
const loading = ref(false);
const formRef = ref<any>(null);
const forgotForm = ref<{
  email: string
  password: string
  viewPassword: boolean
  confirmPassword: string
  viewConfirmPassword: boolean
}>({
  email: '',
  password: '',
  viewPassword: false,
  confirmPassword: '',
  viewConfirmPassword: false,
});
const otp = ref('');

const timeLeft = ref(0);
const TIMER_DURATION = 120;
let timerInterval: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

function startTimer() {
  stopTimer();
  timeLeft.value = TIMER_DURATION;

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

onUnmounted(() => {
  stopTimer();
});

async function handleSendCode() {
  const { valid } = await formRef.value?.validate();

  if (valid) {
    loading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      step.value = 2;
      startTimer();
      notify(t('forgotPassword.feedback.sentSuccess'), 'success');

    } catch (error) {
      notify(t('forgotPassword.feedback.sentError'), 'error');
    } finally {
      loading.value = false;
    }
  }
}

async function handleVerifyCode() {
  if (otp.value.length < 6) return;

  loading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    notify(t('forgotPassword.feedback.verifySuccess'), 'success');
    step.value = 3;
  } catch (error) {
    notify(t('forgotPassword.feedback.verifyError'), 'error');
  } finally {
    loading.value = false;
  }
}

async function handleAlterPassword() {
  const { valid } = await formRef.value?.validate();

  if (valid) {

    loading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      notify(t('forgotPassword.feedback.alterSuccess'), 'success');
    } catch (error) {
      notify(t('forgotPassword.feedback.alterError'), 'error');
    } finally {
      loading.value = false;
    }
  }
}

async function resendCode() {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    otp.value = '';
    startTimer();
    notify(t('forgotPassword.feedback.resendInfo'), 'info');
  } finally {
    loading.value = false;
  }
}

function changeEmail() {
  stopTimer();
  step.value = 1;
  otp.value = '';
}

</script>
