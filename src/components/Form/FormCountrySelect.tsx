import React from "react";

import { COUNTRY_CODES } from "@/constants/countries";
import { appReactMemo } from "@/hocs/appReactMemo";
import { getFormattedCountry } from "@/utils/getFormattedCountry";

import CountryOption from "../CountryOption";

import FormSelect, { IFormSelect } from "./FormSelect";

export interface IFormCountrySelect extends Omit<IFormSelect, "options"> {}

const FormCountrySelect = (props: IFormCountrySelect) => {
  const options = React.useMemo(() => {
    const countriesOptions =
      COUNTRY_CODES.map((countryCode) => {
        return {
          value: countryCode,
          label: getFormattedCountry(countryCode),
          component: <CountryOption countryCode={countryCode} />,
        };
      }) || [];

    return countriesOptions.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
  }, []);

  return <FormSelect {...props} options={options} />;
};

export default appReactMemo(FormCountrySelect);
