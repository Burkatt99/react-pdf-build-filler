import React from "react";

import CountryOption from "@/components/CountryOption";
import { COUNTRY_CODES } from "@/constants/countries";
import { appReactMemo } from "@/hocs/appReactMemo";
import { getFormattedCountry } from "@/utils/getFormattedCountry";

import Select from "../Select";
import { ISelectProps } from "../Select/types";

const CountrySelect = (props: Omit<ISelectProps, "options">) => {
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

  return <Select {...props} options={options} />;
};

export default appReactMemo(CountrySelect);
