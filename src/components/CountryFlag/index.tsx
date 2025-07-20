import { appReactMemo } from "@/hocs/appReactMemo";

import { FLAGS_MAP } from "./constants";

interface ICountryFlag {
  countryCode: string;
  className?: string;
}

const Flag = (props: ICountryFlag) => {
  const { countryCode, className } = props;
  const flagSrc = FLAGS_MAP[countryCode as keyof typeof FLAGS_MAP];

  if (!flagSrc) {
    return null;
  }

  return (
    <div className={className}>
      <img width={20} src={flagSrc} alt={countryCode} loading="lazy" />
    </div>
  );
};

export default appReactMemo(Flag);
