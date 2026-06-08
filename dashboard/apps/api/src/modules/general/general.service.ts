import { Injectable } from '@nestjs/common';
import { ISiteInfo } from '@seven-auto/libs';
import { OptionHelper } from 'src/helpers/options.helper';
import { EnvService } from 'src/modules/env/env.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { optionKey } from './general.const';
import { SiteInfoUpdateDto } from './general.dto';

@Injectable()
export class GeneralService {
  constructor(
    private readonly env: EnvService,
    private readonly prisma: PrismaService,
    private readonly optionHelper: OptionHelper,
  ) {}

  async getSiteInfo(): Promise<ISiteInfo> {
    const siteInfo = {};
    const options = await this.prisma.option.findMany({
      where: {
        key: {
          in: [
            optionKey.SITE_NAME,
            optionKey.SITE_TITLE,
            optionKey.SITE_DESCRIPTION,
            optionKey.SITE_KEYWORDS,
            optionKey.SITE_AUTHOR,
            optionKey.SITE_COPYRIGHT,
            optionKey.SITE_LANGUAGE,
            optionKey.SITE_ICON,
            optionKey.SITE_IMAGE,
            optionKey.SITE_LOGO,
            optionKey.SITE_TEXT_LOGO,
            optionKey.SITE_EMAIL,
            optionKey.SITE_PHONE,
            optionKey.SITE_SOCIAL,
            optionKey.SITE_HEADER,
            optionKey.SITE_FOOTER,
            optionKey.CUSTOM_CSS,
            optionKey.GA_ID,
            optionKey.GTM_ID,
            optionKey.PIXEL_ID,
          ],
        },
      },
    });

    if (options && options.length > 0) {
      const siteName = options.find(
        (item) => item.key === optionKey.SITE_NAME,
      )?.value;
      if (siteName) Object.assign(siteInfo, { siteName });

      const siteTitle = options.find(
        (item) => item.key === optionKey.SITE_TITLE,
      )?.value;
      if (siteTitle) Object.assign(siteInfo, { siteTitle });

      const siteDescription = options.find(
        (item) => item.key === optionKey.SITE_DESCRIPTION,
      )?.value;
      if (siteDescription) Object.assign(siteInfo, { siteDescription });

      const siteKeywords = options.find(
        (item) => item.key === optionKey.SITE_KEYWORDS,
      )?.value;
      if (siteKeywords) Object.assign(siteInfo, { siteKeywords });

      const siteAuthor = options.find(
        (item) => item.key === optionKey.SITE_AUTHOR,
      )?.value;
      if (siteAuthor) Object.assign(siteInfo, { siteAuthor });

      const siteCopyright = options.find(
        (item) => item.key === optionKey.SITE_COPYRIGHT,
      )?.value;
      if (siteCopyright) Object.assign(siteInfo, { siteCopyright });

      const siteLanguage = options.find(
        (item) => item.key === optionKey.SITE_LANGUAGE,
      )?.value;
      if (siteLanguage) Object.assign(siteInfo, { siteLanguage });

      const siteIcon = options.find(
        (item) => item.key === optionKey.SITE_ICON,
      )?.value;
      if (siteIcon) Object.assign(siteInfo, { siteIcon });

      const siteImage = options.find(
        (item) => item.key === optionKey.SITE_IMAGE,
      )?.value;
      if (siteImage) Object.assign(siteInfo, { siteImage });

      const siteLogo = options.find(
        (item) => item.key === optionKey.SITE_LOGO,
      )?.value;
      if (siteLogo) Object.assign(siteInfo, { siteLogo });

      const siteTextLogo = options.find(
        (item) => item.key === optionKey.SITE_TEXT_LOGO,
      )?.value;
      if (siteTextLogo) Object.assign(siteInfo, { siteTextLogo });

      const siteEmail = options.find(
        (item) => item.key === optionKey.SITE_EMAIL,
      )?.value;
      if (siteEmail) Object.assign(siteInfo, { siteEmail });

      const sitePhone = options.find(
        (item) => item.key === optionKey.SITE_PHONE,
      )?.value;

      if (sitePhone) Object.assign(siteInfo, { sitePhone });

      const siteSocial = options.find(
        (item) => item.key === optionKey.SITE_SOCIAL,
      )?.value;
      if (siteSocial) Object.assign(siteInfo, { siteSocial });

      const siteHeader = options.find(
        (item) => item.key === optionKey.SITE_HEADER,
      )?.value;
      if (siteHeader) Object.assign(siteInfo, { siteHeader });

      const siteFooter =
        options.find((item) => item.key === optionKey.SITE_FOOTER)?.value || '';
      if (siteFooter) Object.assign(siteInfo, { siteFooter });

      const customCSS =
        options.find((item) => item.key === optionKey.CUSTOM_CSS)?.value || '';
      if (customCSS) Object.assign(siteInfo, { customCSS });

      const gtmId =
        options.find((item) => item.key === optionKey.GTM_ID)?.value || '';
      if (gtmId) Object.assign(siteInfo, { gtmId });

      const gaId =
        options.find((item) => item.key === optionKey.GA_ID)?.value || '';
      if (gaId) Object.assign(siteInfo, { gaId });

      const pixelId =
        options.find((item) => item.key === optionKey.PIXEL_ID)?.value || '';
      if (pixelId) Object.assign(siteInfo, { pixelId });

      const facebookAppId =
        options.find((item) => item.key === optionKey.FACEBOOK_APP_ID)?.value ||
        '';
      if (facebookAppId) Object.assign(siteInfo, { facebookAppId });
    }

    return siteInfo;
  }

  async updateSiteInfo({
    siteName,
    siteTitle,
    siteDescription,
    siteKeywords,
    siteAuthor,
    siteCopyright,
    siteLanguage,
    siteIcon,
    siteImage,
    siteLogo,
    siteTextLogo,
    siteEmail,
    sitePhone,
    siteSocial,
    siteFooter,
    siteHeader,
    gaId,
    gtmId,
    pixelId,
    facebookAppId,
    customCss,
  }: SiteInfoUpdateDto): Promise<ISiteInfo> {
    if (siteName) await this.optionHelper.update(optionKey.SITE_NAME, siteName);

    if (siteTitle)
      await this.optionHelper.update(optionKey.SITE_TITLE, siteTitle);

    if (siteDescription)
      await this.optionHelper.update(
        optionKey.SITE_DESCRIPTION,
        siteDescription,
      );

    if (siteKeywords)
      await this.optionHelper.update(optionKey.SITE_KEYWORDS, siteKeywords);

    if (siteAuthor)
      await this.optionHelper.update(optionKey.SITE_AUTHOR, siteAuthor);

    if (siteCopyright)
      await this.optionHelper.update(optionKey.SITE_COPYRIGHT, siteCopyright);

    if (siteLanguage)
      await this.optionHelper.update(optionKey.SITE_LANGUAGE, siteLanguage);

    if (siteIcon) await this.optionHelper.update(optionKey.SITE_ICON, siteIcon);

    if (siteImage)
      await this.optionHelper.update(optionKey.SITE_IMAGE, siteImage);

    if (siteLogo) await this.optionHelper.update(optionKey.SITE_LOGO, siteLogo);

    if (siteTextLogo)
      await this.optionHelper.update(optionKey.SITE_TEXT_LOGO, siteTextLogo);

    if (siteEmail)
      await this.optionHelper.update(optionKey.SITE_EMAIL, siteEmail);

    if (sitePhone)
      await this.optionHelper.update(optionKey.SITE_PHONE, sitePhone);

    if (siteSocial)
      await this.optionHelper.update(optionKey.SITE_SOCIAL, siteSocial);

    if (siteHeader)
      await this.optionHelper.update(optionKey.SITE_HEADER, siteHeader);

    if (siteFooter)
      await this.optionHelper.update(optionKey.SITE_FOOTER, siteFooter);

    if (customCss)
      await this.optionHelper.update(optionKey.CUSTOM_CSS, customCss);

    if (gtmId) await this.optionHelper.update(optionKey.GTM_ID, gtmId);

    if (gaId) await this.optionHelper.update(optionKey.GA_ID, gaId);

    if (pixelId) await this.optionHelper.update(optionKey.PIXEL_ID, pixelId);

    if (facebookAppId)
      await this.optionHelper.update(optionKey.FACEBOOK_APP_ID, facebookAppId);

    return this.getSiteInfo();
  }

  async test() {
    return true;
  }
}
