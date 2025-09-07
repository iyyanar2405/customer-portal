// session-timeout.constants.ts
import { AuthTokenConstants } from '@customer-portal/shared';

export const SessionTimeout = {
    CHECK_INTERVAL_MS: 60 * 1000,
    BUFFER_TIME_MINUTES: 10,
    IDLE_THRESHOLD_TIME_MINUTES: 15,
    SHORT_TOKEN_THRESHOLD_MINUTES: 10,
    ACTIVITY_WINDOW_MINUTES: 1,
    SESSION_TIMEOUT_MODAL: 'session_timeout_modal',
};

export const SESSION_STORAGE_KEYS = [
    AuthTokenConstants.LAST_ACTIVITY_KEY,
    AuthTokenConstants.TOKEN_EXPIRY_KEY,
    AuthTokenConstants.TOKEN_DURATION_KEY,
    AuthTokenConstants.SHOW_MODAL_KEY,
] as const;