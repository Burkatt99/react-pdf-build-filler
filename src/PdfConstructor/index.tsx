import { PdfConstructorProvider } from "@/context";
import { appReactMemo } from "@/hocs/appReactMemo";

import CustomFormBuilder from "./components/CustomFormBuilder";

import { IPdfConstructorProps } from "./types";

const PdfConstructor = (props: IPdfConstructorProps) => {
  const { data, classes, customComponents, onSave, onUpdateField } = props;

  return (
    <PdfConstructorProvider>
      <CustomFormBuilder
        data={data}
        classes={classes}
        onSave={onSave}
        customComponents={customComponents}
        onUpdateField={onUpdateField}
      />
    </PdfConstructorProvider>
  );
};

export default appReactMemo(PdfConstructor);
