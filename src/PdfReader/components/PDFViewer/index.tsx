import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import classNames from "classnames";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";
import { pdfReaderClasses } from "@/PdfReader/constants";

interface IViewerProps {
  fileUrl: string | Uint8Array;
  defaultScale?: number;
  className?: string;
}

const PDFViewer = (props: IViewerProps) => {
  const { fileUrl, defaultScale = 1.3, className } = props;
  const { renderDefaultToolbar } = defaultLayoutPlugin().toolbarPluginInstance;

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Open: () => <></>,
    Print: () => <></>,
    SwitchTheme: () => <></>,
  });

  const renderToolbar = (
    Toolbar: (props: ToolbarProps) => React.ReactElement,
  ) => <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) =>
      defaultTabs.filter(
        (tab, index) => index !== 1 && index !== 2, // Remove bookmarks and attachments
      ),
    renderToolbar,
  });

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className={classNames(pdfReaderClasses.pdfViewer, className)}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={defaultScale}
        />
      </div>
    </Worker>
  );
};

export default appReactMemo(PDFViewer);
