function getRequiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        console.error(`Error: Missing ${name} environment variable`);
        process.exit(1);
    }
    return value;
}
export const API_KEY = getRequiredEnv("MEMBERKIT_API_KEY");
export const BASE_URL = "https://memberkit.com.br/api/v1";
