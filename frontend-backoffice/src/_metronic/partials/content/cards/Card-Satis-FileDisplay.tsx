/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useEffect } from 'react';
import {
  getFileExtensionFromFileLink,
  getFileSource,
} from '../../../../app/utils/functions';
import { KTSVG, toAbsoluteUrl } from '../../../helpers';
import { useIntl } from 'react-intl';

type Props = {
  fileData: any;
};

const CardSatisFileDisplay: FC<Props> = ({ fileData }) => {
  const intl = useIntl();

  useEffect(() => {
    console.log(fileData);
  }, []);

  return (
    <>
      <div
        className="modal bg-white fade"
        tabIndex={-1}
        id={'kt_modal_view_file_content___' + fileData.id}
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content shadow-none">
            <div className="modal-header">
              <h5 className="modal-title">{fileData.name}</h5>
              <div
                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <KTSVG
                  path="media/icons/duotune/arrows/arr061.svg"
                  className="svg-icon svg-icon-2x"
                />
              </div>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-12 d-flex">
                  {getFileExtensionFromFileLink(fileData.path) != 'pdf' ? (
                    <img
                      src={getFileSource(fileData.id)}
                      alt=""
                      style={{ margin: '0 auto' }}
                    />
                  ) : (
                    <embed
                      src={getFileSource(fileData.id)}
                      type="application/pdf"
                      width={100}
                    ></embed>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-custom overlay overflow-hidden h-100">
        <div className="card-body d-flex justify-content-center text-center flex-column p-0">
          <div className="overlay-wrapper">
            <img
              src={
                getFileExtensionFromFileLink(fileData.path) != 'pdf'
                  ? getFileSource(fileData.id)
                  : toAbsoluteUrl('media/file-types/pdf.png')
              }
              alt=""
              className="w-100 rounded"
            />
          </div>

          <div className="overlay-layer bg-dark bg-opacity-10">
            <a
              href="javascript:void(0)"
              className="btn btn-primary btn-shadow"
              data-bs-toggle="modal"
              data-bs-target={'#kt_modal_view_file_content___' + fileData.id}
            >
              {intl.formatMessage({ id: 'GEN.VIEW' })}
            </a>
          </div>

          {/* {

          getFileExtensionFromFileLink(fileData.path) != 'pdf'  ?

          <img src={ getFileSource(fileData.id) } alt="" />

          :

          <embed  src={ getFileSource(fileData.id) } type="application/pdf" width={100}></embed>

        } */}
        </div>
      </div>
    </>
  );
};

export { CardSatisFileDisplay };
