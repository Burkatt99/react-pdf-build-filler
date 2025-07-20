import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import cn from "classnames";

import "./styles.scss";

import Button from "@/components/Button";
import { CUSTOM_FIELDS_LIST } from "@/constants/customFields";
import {
  IDataConstructor,
  IResult,
  TCustomComponents,
} from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";
import { formBuilderClasses } from "@/PdfConstructor/constants";
import useCustomFormBuilder from "@/PdfConstructor/hooks/useCustomFormBuilder";
import { IPdfConstructorClasses } from "@/PdfConstructor/types";

import CustomDragElement from "../CustomDragElement";
import FieldsColumn from "../FieldsColumn";
import PdfPreviewZone from "../PdfPreviewZone";
import Settings from "../Settings";

interface ICustomFormBuilderProps {
  data: IDataConstructor;
  classes?: IPdfConstructorClasses;
  customComponents?: TCustomComponents;
  onSave: (result: IResult) => void;
  onUpdateField?: () => void;
}

const CustomFormBuilder = (props: ICustomFormBuilderProps) => {
  const {
    data: { pdfFile, fields: createdFields, templateName = "PdfTemplate" },
    classes,
    customComponents,
    onSave,
    onUpdateField,
  } = props;

  const {
    ref,
    headerRef,
    fields,
    fileUrl,
    contentHeight,
    isNewTemplate,
    onRemoveField,
    onResizeField,
    onSelect,
    onAddField,
    onMoveField,
    handleSaveChanges,
  } = useCustomFormBuilder({
    pdfFile,
    createdFields,
    onSave,
  });

  return (
    <>
      <div
        className={cn(formBuilderClasses.header, classes?.formBuilder?.header)}
        ref={headerRef}
      >
        <div
          className={cn(formBuilderClasses.title, classes?.formBuilder?.title)}
        >
          {templateName}
        </div>
        <Button
          variant="primary"
          onClick={handleSaveChanges}
          disabled={!fields.length}
          className={cn(
            formBuilderClasses.button,
            classes?.formBuilder?.button,
          )}
        >
          {isNewTemplate ? "Save" : "Update"}
        </Button>
      </div>

      <DndProvider backend={HTML5Backend} options={{ delay: 0 }}>
        <CustomDragElement />
        <div ref={ref} className={cn(formBuilderClasses.container)}>
          <div
            className={cn(formBuilderClasses.constructorBody)}
            style={{
              height: `${(contentHeight || 0) - 68}px`,
              maxHeight: `${(contentHeight || 0) - 68}px`,
            }}
          >
            <FieldsColumn
              customFieldsList={CUSTOM_FIELDS_LIST}
              onRemoveField={onRemoveField}
              classes={classes?.customField}
            />
            <div className={formBuilderClasses.column}>
              <div className={formBuilderClasses.wrapper}>
                {fileUrl && (
                  <PdfPreviewZone
                    fields={fields}
                    fileUrl={fileUrl}
                    isNewTemplate={isNewTemplate}
                    onAddField={onAddField}
                    onMoveField={onMoveField}
                    onSelect={onSelect}
                    onResizeField={onResizeField}
                    maxHeight={contentHeight || 0}
                    classes={classes?.pdfViewerZone}
                  />
                )}
              </div>
            </div>
            <Settings
              onUpdateField={onUpdateField}
              classes={classes?.settings}
              customComponents={customComponents}
            />
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default appReactMemo(CustomFormBuilder);
