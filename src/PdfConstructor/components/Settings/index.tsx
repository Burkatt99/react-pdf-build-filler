import React, { useCallback } from "react";
import { FormProvider } from "react-hook-form";
import cn from "classnames";

import "./styles.scss";

import Button from "@/components/Button";
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tabs/Tab";
import { TABS } from "@/constants/settings";
import { TCustomComponents } from "@/constants/types";
import { appReactMemo } from "@/hocs/appReactMemo";
import { SettingsClasses } from "@/PdfConstructor/types";

import { settingsClasses } from "../../constants";

import Advance from "./_tabs/Advance";
import Base from "./_tabs/Base";
import PreviewField from "./components/PreviewField";
import useSettings from "./hooks/useSettings";

type SettingsProps = {
  classes?: SettingsClasses;
  customComponents?: TCustomComponents;
  onUpdateField?: () => void;
};

const Settings = (_props: SettingsProps) => {
  const { classes, customComponents } = _props;
  const {
    selected,
    selectedTab,
    filteredTabs,
    disabledSave,
    methods,
    sortOptionsError,
    isDropdownField,
    onTabChange,
    handleSubmitForm,
    handleSetOptions,
  } = useSettings(_props);

  const { handleSubmit, formState, watch } = methods;
  const { isSubmitting } = formState;
  const allValues = watch();

  const renderTab = useCallback(() => {
    switch (selectedTab) {
      case "base":
        return (
          <Base
            requiredDisable={!!allValues.condition}
            classes={classes?.baseTab}
            componentClasses={classes?.components}
            customComponents={customComponents}
            handleSetOptions={handleSetOptions}
          />
        );
      case "advance":
        return (
          <Advance
            className={cn(settingsClasses.tabContent, classes?.tabContent)}
            componentClasses={classes?.components}
          />
        );
      default:
        return null;
    }
  }, [selectedTab]);

  return (
    <div className={cn(settingsClasses.container, classes?.container)}>
      {!selected ? (
        <>
          <div
            className={cn(
              settingsClasses.notFoundField,
              classes?.notFoundField,
            )}
          >
            {"To view options select a fillable field"}
          </div>
        </>
      ) : (
        <>
          <div
            className={cn(
              settingsClasses.fieldSettingsContent,
              classes?.fieldSettingsContent,
            )}
          >
            <div className={cn(settingsClasses.title, classes?.title)}>
              {`${selected.name} ${"Field Option"}`}
            </div>

            <Tabs
              useKeyValue
              value={selectedTab}
              onChange={onTabChange}
              classes={classes?.tabs}
            >
              {filteredTabs.map((tab, index) => (
                <Tab
                  key={index}
                  tabKey={tab}
                  label={TABS[tab]}
                  className={cn(settingsClasses.tab, classes?.tab)}
                />
              ))}
            </Tabs>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleSubmitForm)}>
                {renderTab()}

                {isDropdownField && (
                  <div className={cn(settingsClasses.error, classes?.error)}>
                    {sortOptionsError?.message || ""}
                  </div>
                )}

                <Button
                  variant="primary"
                  width="100%"
                  disabled={isSubmitting || disabledSave}
                  loading={isSubmitting}
                  onClick={handleSubmit(handleSubmitForm)}
                  className={cn(
                    settingsClasses.saveButton,
                    classes?.saveButton,
                  )}
                >
                  {"Save field"}
                </Button>
              </form>
            </FormProvider>

            <PreviewField
              fieldName={allValues.fieldName}
              label={allValues.label || ""}
              type={selected.type}
              classes={classes?.preview}
              componentClasses={classes?.components}
              customComponents={customComponents}
              width={selected.width}
              height={selected.height}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default appReactMemo(Settings);
