import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";
import { getFormattedCountry } from "@/utils/getFormattedCountry";

import CountryFlag from "../CountryFlag";

import { countryOptionClasses } from "./constants";

type CountryOptionClasses = Partial<{
  valueContainer: string;
  name: string;
}>;

interface ICountryOption {
  countryCode: string;
  classes?: CountryOptionClasses;
}

const CountryOption = ({ countryCode, classes }: ICountryOption) => {
  return (
    <div
      className={cn(
        countryOptionClasses.valueContainer,
        classes?.valueContainer,
      )}
    >
      <CountryFlag countryCode={countryCode} />
      <div className={cn(countryOptionClasses.name, classes?.name)}>
        {getFormattedCountry(countryCode)}
      </div>
    </div>
  );
};

export default appReactMemo(CountryOption);
