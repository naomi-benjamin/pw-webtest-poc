import 'dotenv/config';

export const TestUsers = {
    standardUser: {
        username: process.env.STANDARD_USER ?? 'standard_user',
        password: process.env.STANDARD_PASSWORD ?? 'secret_sauce',
    },
    performanceGlitchUser: {
        username: process.env.PERF_GLITCH_USER ?? 'performance_glitch_user',
        password: process.env.PERF_GLITCH_PASSWORD ?? 'secret_sauce',
    },
    incorrectPassword: {
        username: process.env.STANDARD_USER ?? 'standard_user',
        password: 'public_sauce',
    },
    lockedOutUser: {
        username: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
        password: process.env.LOCKED_OUT_PASSWORD ?? 'secret_sauce',
    },
    nonExistentUser: {
        username: 'non_existent',
        password: 'secret_sauce',
    }
}
