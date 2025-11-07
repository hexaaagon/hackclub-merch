type WhitelistedPagePermission = string[];

export const guest: WhitelistedPagePermission = [
  "/",
  "/home",
  "/login",
  "/error-pages/**",
];

export const member: WhitelistedPagePermission = [
  ...guest.filter((path) => path !== "/login"),
  "/dashboard/**",
  "/products/**",
  "/orders/**",
  "/settings/**",
];

export const reviewer: WhitelistedPagePermission = [...member, "/reviews/**"];

export const logistics: WhitelistedPagePermission = [
  ...member,
  "/logistics/**",
];

export const designer: WhitelistedPagePermission = [...member, "/designs/**"];

export const admin: WhitelistedPagePermission = ["/**"];
