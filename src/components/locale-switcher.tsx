"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

export function LocaleSwitcher() {
  const t = useTranslations("SettingsView.locale");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="w-full md:w-auto md:max-w-[280px]">
      <Select defaultValue={locale} onValueChange={onSelectChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("en")}</SelectItem>
          <SelectItem value="fr">{t("fr")}</SelectItem>
          <SelectItem value="hi">{t("hi")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
