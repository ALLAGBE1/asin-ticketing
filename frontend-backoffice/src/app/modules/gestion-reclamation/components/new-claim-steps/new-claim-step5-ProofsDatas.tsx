/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { KTIcon } from '../../../../../_metronic/helpers';
import {
  getFileExtensionFromFileType,
  getFileTypeIcon,
  handleHttpError,
} from '../../../../utils/functions';
import { CardSatisFileExt } from '../../../../../_metronic/partials/content/cards/Card-Satis-FileExt';
import { FileUploadRequest } from '../../../gestion-paramettres/core/services/fileUploadRequests';
import { notificationSuccessToast } from '../../../../utils/notificationToasts';
import { CardSatisFileDisplay } from '../../../../../_metronic/partials/content/cards/Card-Satis-FileDisplay';

const fileUploadRequest = new FileUploadRequest();

const NewClaimStep5ProofsDatas: FC<any> = (props) => {
  const intl = useIntl();

  // store new proofs files :: files ID List
  const [proofsFilesList, setProofsFilesList] = useState(Array<number>);

  // store new proofs files
  const [proofsFilesToUploadList, setProofsFilesToUploadList] = useState(
    Array<any>,
  );

  // store proofs files progressions
  const [proofsFilesProgressList, setProofsFilesProgressList] = useState(
    Array<number>,
  );

  // store existing proofs files :: in claim updating case
  const [proofsExistingFilesToUpdateList, setProofsExistingFilesToUpdateList] =
    useState<any>();

  const onFileChange = (event: any) => {
    const files = Array.from(event.target.files);

    // tell ClaimNew/ClaimUpdate component that proof file is selected
    if (files.length != 0) props._updateProofsFilesStatus(true);

    setProofsFilesToUploadList([...proofsFilesToUploadList, ...files]);

    console.log(proofsFilesToUploadList);
    // save selected proof files data
    props._saveFileToUpload({ proofsFilesToUploadList: [...proofsFilesToUploadList, ...files] });
  };

  const pickUp_file = () => {
    document.getElementById('file_pickup')?.click();
  };

  const uploadProofs = async () => {
    console.log('Starting file upload 🎯🎯🎯');
    console.log(proofsFilesToUploadList);

    // initialize proof files  uploadingProgression array
    // it will contain the progression of each file uploading
    setProofsFilesProgressList(new Array(proofsFilesToUploadList.length));
    console.log(proofsFilesProgressList);

    for (let index = 0; index < proofsFilesToUploadList.length; index++) {
      await fileUploadRequest
        .addFile(proofsFilesToUploadList[index], (event: any) => {
          const progressList = proofsFilesProgressList;
          progressList[index] = Math.round((100 * event.loaded) / event.total);

          setProofsFilesProgressList([...progressList]);
        })
        .then((response: any) => {
          console.log(response.data);

          notificationSuccessToast(
            `${proofsFilesToUploadList[index].name} is uploaded`,
          );

          const _proofsList = proofsFilesList;
          _proofsList.push(response.data.id);
          setProofsFilesList([..._proofsList]);

          console.log(proofsFilesList);
          console.log(
            proofsFilesList.length,
            proofsFilesToUploadList.length,
            proofsFilesProgressList.length,
          );

          // check if all file are uploaded
          if (
            proofsFilesList.length == proofsFilesToUploadList.length &&
            proofsFilesToUploadList.length == proofsFilesProgressList.length &&
            // check if all of files are uploading to 100%.
            proofsFilesProgressList.filter((percent) => percent == 100)
              .length == proofsFilesProgressList.length
          ) {
            // when we are in newClaim process OR there is not an existing files
            if (
              proofsExistingFilesToUpdateList?.length == 0 ||
              !proofsExistingFilesToUpdateList
            ) {
              props._proofFilesUploadDone(proofsFilesList);
            } else {
              props._proofFilesUploadDone([
                ...proofsExistingFilesToUpdateList.map(
                  (proof: any) => proof.id,
                ),
                ...proofsFilesList,
              ]);
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
          handleHttpError(error);
        });
    }
  };

  useEffect(() => {
    if (props.startProofFilesUploading) {
      // start files uploader from parent order
      uploadProofs();
    }

    // when file is selected in the adding form process
    if (props.savedFilesToUpload) {
      setProofsFilesToUploadList(props.savedFilesToUpload)
    }

    // if the updating claim has proofs file(s)
    if (props.existingProofFiles && props.existingProofFiles.length) {
      console.log(props.existingProofFiles);
      setProofsExistingFilesToUpdateList(props.existingProofFiles);
    }
  }, [props.startProofFilesUploading, props.proofsFilesProgressList]);

  return (
    <>
      {/* <a href='javascript:void()' onClick={uploadProofs} className='btn btn-primary btn-sm mb-9'>
        <KTIcon iconName='file' className='fs-3 ms-3' />
        <span>Start uploading 🪄🪄</span>
    </a> */}

      <div className="d-flex flex-wrap flex-stack mb-6">
        <div>
          <h2 className="fw-bolder text-gray-900">
            {intl.formatMessage({ id: 'CLAIM.PROOFS_DATAS' })}
          </h2>
          <div className="text-gray-500 fw-bold fs-6">
            {intl.formatMessage({ id: 'CLAIM.PROOFS_DATAS_DESCRIPTION' })}
          </div>
        </div>

        <div className="d-flex my-2">
          <input
            onChange={onFileChange}
            type="file"
            multiple
            accept=".png, .jpg, .jpeg, .pdf"
            id="file_pickup"
          />

          <a
            href="javascript:void()"
            onClick={pickUp_file}
            className="btn btn-primary btn-sm pulse pulse-primary me-10 mb-1"
          >
            <KTIcon iconName="note" className="fs-3 ms-3" />
            <span>{intl.formatMessage({ id: 'GEN.PICK_PROOFS' })}</span>
          </a>
        </div>
      </div>

      {proofsExistingFilesToUpdateList &&
        proofsExistingFilesToUpdateList?.length != 0 && (
          <>
            <div className="row g-6 g-xl-9 mb-2 mb-xl-9 mt-5">
              <h4>{intl.formatMessage({ id: 'GEN.OLD_PROOFS' })}</h4>

              {proofsExistingFilesToUpdateList?.map(
                (row: { id: null | undefined }) => (
                  <>
                    <div key={row.id} className="col-6 col-md-4 col-lg-3 mb-10">
                      <CardSatisFileDisplay fileData={row} />
                      <div className="row d-flex">
                        <a
                          style={{ margin: '0 auto' }}
                          className="btn btn-danger mt-4"
                          // onClick={ () => removeFileInExistingProofsList(row) }>
                          onClick={() =>
                            setProofsExistingFilesToUpdateList(
                              proofsExistingFilesToUpdateList.filter(
                                (file: any) => row.id != file.id,
                              ),
                            )
                          }
                        >
                          <span>
                            {intl.formatMessage({ id: 'GEN.DELETE' })}
                          </span>
                          <KTIcon iconName="file" className="fs-3 ms-3" />
                        </a>
                      </div>
                    </div>
                  </>
                ),
              )}
            </div>
          </>
        )}

      <div className="row g-6 g-xl-9 mb-xl-9 mt-5">
        {proofsExistingFilesToUpdateList &&
          proofsExistingFilesToUpdateList?.length != 0 && (
            <h4>{intl.formatMessage({ id: 'GEN.NEW_PROOFS' })}</h4>
          )}

        {proofsFilesToUploadList?.map((row, index) => (
          <div key={row.name} className="col-md-4">
            <CardSatisFileExt
              icon={getFileTypeIcon(getFileExtensionFromFileType(row.type))}
              title={row.name}
              progress={proofsFilesProgressList[index]}
            />

            <div className="row d-flex">
              <a
                style={{
                  position: 'relative',
                  bottom: '32px',
                  margin: '0 auto',
                }}
                className="col-4 btn btn-danger "
                onClick={() =>
                  setProofsFilesToUploadList(
                    proofsFilesToUploadList.filter(
                      (file: any) => row.name != file.name,
                    ),
                  )
                }
              >
                <KTIcon iconName="trash" className="fs-3 ms-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {((proofsExistingFilesToUpdateList?.length == 0 &&
        proofsFilesToUploadList.length == 0) ||
        proofsFilesToUploadList.length == 0) && (
        <div className="row mt-20 mb-5">
          <h3 className="fw-bolder text-center text-danger col-12 mv-2rem">
            🚫 {intl.formatMessage({ id: 'GEN.NO_PROOFS' })}
          </h3>
        </div>
      )}
    </>
  );
};

export { NewClaimStep5ProofsDatas };
