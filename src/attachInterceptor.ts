import { attachAxiosInterceptor } from "./axiosInterceptor";
import { attachFetchInterceptor } from "./fetchInterceptor";
import detectFetchMethod from "./fetchMethodDetect";

export function attachInterceptor() {
  const method = detectFetchMethod();

  if (method === "axios") {
      attachAxiosInterceptor();
  } else if (method === "fetch") {
      attachFetchInterceptor();
  } else {
    console.log("No fetch method detected");
  }
}