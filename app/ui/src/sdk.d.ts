// The dashboard host provides @kirocrew/app-sdk at runtime through its import map. Only the
// part this app uses is declared here, and it is read through a namespace import so an older
// host without it still loads the bundle.
declare module '@kirocrew/app-sdk' {
  export interface AppApi {
    get<T>(path: string, init?: RequestInit): Promise<T>;
  }
  export function useAppApi(): AppApi;
}
