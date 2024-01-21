import React, { useState } from 'react'
import { DlFilesOnStateChange, DownloadFileDesc, DownloadFiles, FileState, ProgressState} from 'multi-file-download'

export interface MultiDownloadProps {

}

const images: DownloadFileDesc[] = [
    { url: "/00TestFiles/anything_01.jpeg", size: 49722 },
    { url: "/00TestFiles/anything_02.png", size: 1616740 },
    { url: "/00TestFiles/anything_03.png", size: 2028247 },
    { url: "/00TestFiles/anything_04.png", size: 2327637 },
    { url: "/00TestFiles/anything_05.png", size: 1493098 },
    { url: "/00TestFiles/anything_06.png", size: 1813885 },
    { url: "/00TestFiles/anything_07.png", size: 1830935 },
    { url: "/00TestFiles/anything_08.png", size: 2485692 },
];

/// \tood implement in test webserver
const imgErr: DownloadFileDesc[] = [
    { url: "error/404NotExist.txt" },
    { url: "error/403NotAllowed.txt" },
    { url: "error/500InternalServerErrror.txt" },
];

interface DlFilesStateEntry {
    state: FileState;
    progress?: ProgressState;
    error?: Error;
}

function DlFileState({ state, error, progress, url }: DlFilesStateEntry & { url: string }) {
    const stateName = FileState[state]
    return (
        <div>{url}: {stateName} - {progress !== undefined ? `${progress.bytes}/${progress.totalBytes}` : ''} {error !== undefined && error.message} </div>
    );
}

export default function ({ }: MultiDownloadProps) {
    const [dlFiles, setDlFiles] = useState<{ [key: string]: DlFilesStateEntry }>({});

    const dirPickOpts = {
        mode: "readwrite",
        //startIn: "pictures"
    };

    const download = async () => {
        setDlFiles({});

        const dirHandle = await (window as any).showDirectoryPicker(dirPickOpts) as FileSystemDirectoryHandle;
        const onStateUpdate: DlFilesOnStateChange = (url, state) => {
            setDlFiles(
                (dlFiles) => {
                let element: DlFilesStateEntry;
                if (url in dlFiles) {
                    element = dlFiles[url];
                    element = { ...element, ...state };
                }
                else if (state.state !== undefined) {
                    element = { state: state.state, ...state };
                } else {
                    console.error("Stored DlFilesState broken.");
                    return dlFiles;
                }
                return { ...dlFiles, [url]: element };
            });
        };

        await DownloadFiles(dirHandle, images, {
            onStateUpdate: onStateUpdate
        });

    }
    const DlFiles = Object.keys(dlFiles).map((url) => <DlFileState {...dlFiles[url]} url={url} key={url} />);

    return (
        <div>
            <div>{DlFiles}</div>
            <button onClick={download}>Download</button>
        </div>
    );
}
