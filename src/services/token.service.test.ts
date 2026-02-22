import { describe, it, expect } from "vitest";
import {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  isAuthenticated,
  logout,
} from "./token.service";
import { buildUser } from "@/test/factories";

describe("token.service", () => {
  describe("saveToken / getToken", () => {
    it("stores and retrieves a token", () => {
      saveToken("abc123");
      expect(getToken()).toBe("abc123");
    });

    it("returns null when no token exists", () => {
      expect(getToken()).toBeNull();
    });
  });

  describe("removeToken", () => {
    it("removes token and user from localStorage", () => {
      saveToken("abc123");
      saveUser(buildUser());
      removeToken();
      expect(getToken()).toBeNull();
      expect(getUser()).toBeNull();
    });
  });

  describe("saveUser / getUser", () => {
    it("stores and retrieves a user as JSON", () => {
      const user = buildUser();
      saveUser(user);
      expect(getUser()).toEqual(user);
    });

    it("returns null when no user exists", () => {
      expect(getUser()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when token exists", () => {
      saveToken("abc123");
      expect(isAuthenticated()).toBe(true);
    });

    it("returns false when no token", () => {
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("logout", () => {
    it("clears token and user", () => {
      saveToken("abc");
      saveUser(buildUser());
      logout();
      expect(getToken()).toBeNull();
      expect(getUser()).toBeNull();
    });
  });
});
