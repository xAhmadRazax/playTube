import { Resend } from "resend";
import { PublicUserType, UserDocumentType } from "../types/userModel.type.js";
import { Settings } from "../models/settings.model.js";
import { SettingsDocumentType } from "../types/settings.type.js";

export class Email {
  private resend: Resend;
  private settings: SettingsDocumentType | null = null; // Cache settings to avoid multiple DB calls

  constructor(
    private readonly user: PublicUserType,
    private readonly url: string
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  // Get settings once and cache them
  private async getSettings() {
    this.settings = await Settings.findById("singleton");
    if (!this.settings) {
      throw new Error("Settings not found");
    }
    return this;
  }

  // Generic method that handles template from settings
  async sendMail(template: string, subject: string) {
    if (!this.settings) {
      throw new Error("Settings not found");
    }
    console.log("sending....mail");

    return await this.resend.emails.send({
      from: this.settings.email,
      subject,
      to: this.user.email,
      html: template,
    });
  }

  // Specific methods for different email types
  async sendWelcomeAndVerifyEmail() {
    if (!this.settings) {
      throw new Error("Settings not found");
    }

    let template = this.settings.welcomeAndVerifyEmailTemplate;
    template = template.replace(/\$\{siteName\}/g, this.settings.siteName);
    template = template.replace(/\$\{siteLogo\}/g, this.settings.siteLogo);
    template = template.replace(/\$\{url\}/g, this.url);
    template = template.replace(/\$\{fullName\}/g, this.user.fullName);

    return await this.sendMail(template, "Welcome! Please verify your email");
  }

  async sendPasswordResetEmail() {
    if (!this.settings) {
      throw new Error("Settings not found");
    }

    let template = this.settings.forgotPasswordEmailTemplate;
    template = template.replace(/\$\{siteName\}/g, this.settings.siteName);
    template = template.replace(/\$\{siteLogo\}/g, this.settings.siteLogo);
    template = template.replace(/\$\{url\}/g, this.url);
    template = template.replace(/\$\{fullName\}/g, this.user.fullName);

    return await this.sendMail(template, "Reset your password");
  }

  // Alternative: if you want to pass custom templates
  // async sendCustomMail(template: string, subject: string) {
  //   const settings = await this.getSettings();

  //   await this.resend.emails.send({
  //     from: settings.email,
  //     subject,
  //     to: this.user.email,
  //     html: template,
  //   });
  // }

  static async init(user: PublicUserType, url: string) {
    return await new Email(user, url).getSettings();
  }
}
