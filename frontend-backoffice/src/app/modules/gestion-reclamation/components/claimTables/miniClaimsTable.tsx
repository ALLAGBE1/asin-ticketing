/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ClaimModel } from '../../core/models/Claim';
import { useNavigate } from 'react-router-dom';
import { KTIcon } from '../../../../../_metronic/helpers';

const MiniClaimsTable: FC<any> = (props: any) => {
  const intl = useIntl();

  const navigate = useNavigate();

  const [claimDatas, setclaimDatas] = useState([
    {
      reference: null,
      location_event: 'Description',
      id: 1,
      description: 'Description',
      expect: "J'attends votre réponse avec des détails plus claires",
      amount: 2000,
      is_reminder: true,
      date_event: '2024-01-24T16:00:42Z',
      reception_channel_id: 7,
      reception_channel: {
        libelle: 'MOBILE',
      },
      response_channel_id: 1,
      response_channel: {
        libelle: 'SMS',
      },
      currency_id: 4,
      currency: {
        libelle: 'FCFA',
      },
      status_id: 2,
      status: {
        libelle: 'INCOMPLET',
      },
      type_id: 9,
      type: {
        libelle: "Erreur sur attestation d'assurance",
      },
      institution_id: 4,
      institution: {
        name: 'SLA Non Vie Togo',
        acronym: 'SLA',
        IsoCode: '0021',
        type_institution_id: 5,
      },
      object_id: 6,
      object: {
        libelle: "Divulgation d'informations",
        description: 'S.O',
        security_level_id: 5,
        duration_treatment_id: 4,
        category_id: 14,
      },
      customer_id: 10,
      customer: {
        id: 10,
        person: {
          nom: 'TAIO',
          prenom: 'Sylvain',
          sexe: 'M',
          ville: 'Cotonou',
          telephone: '+22966323542',
          email: 'sylvtaio@gmail.com',
        },
        account_number: 'BJ000456789',
        customer_type_id: 3,
        customer_type: {
          libelle: 'Personne physique',
        },
      },
    },
    {
      reference: null,
      location_event: 'fr',
      id: 2,
      description: 'de',
      expect: 'fe',
      amount: 22,
      is_reminder: false,
      date_event: '2024-01-12T14:54:00Z',
      reception_channel_id: 2,
      reception_channel: {
        libelle: 'TELEPHONE',
      },
      response_channel_id: 1,
      response_channel: {
        libelle: 'SMS',
      },
      currency_id: 4,
      currency: {
        libelle: 'FCFA',
      },
      status_id: 2,
      status: {
        libelle: 'INCOMPLET',
      },
      type_id: 11,
      type: {
        libelle: 'Erreur de cotation',
      },
      institution_id: 4,
      institution: {
        name: 'SLA Non Vie Togo',
        acronym: 'SLA',
        IsoCode: '0021',
        type_institution_id: 5,
      },
      object_id: 7,
      object: {
        libelle: 'Demande vidéo de surveillance',
        description: 'Sans objet',
        security_level_id: 6,
        duration_treatment_id: 5,
        category_id: 14,
      },
      customer_id: 8,
      customer: {
        id: 8,
        person: {
          nom: 'TAIO',
          prenom: 'Sylvain',
          sexe: 'M',
          ville: 'Cotonou',
          telephone: '+22966323542',
          email: 'sylvtaio@gmail.com',
        },
        account_number: 'BJ000456789',
        customer_type_id: 3,
        customer_type: {
          libelle: 'Personne physique',
        },
      },
    },
    {
      reference: null,
      location_event: 'Description',
      id: 3,
      description: 'Description',
      expect: "J'attends votre réponse avec des détails plus claires",
      amount: 2000,
      is_reminder: true,
      date_event: '2024-01-24T16:00:42Z',
      reception_channel_id: 7,
      reception_channel: {
        libelle: 'MOBILE',
      },
      response_channel_id: 1,
      response_channel: {
        libelle: 'SMS',
      },
      currency_id: 4,
      currency: {
        libelle: 'FCFA',
      },
      status_id: 2,
      status: {
        libelle: 'INCOMPLET',
      },
      type_id: 9,
      type: {
        libelle: "Erreur sur attestation d'assurance",
      },
      institution_id: 4,
      institution: {
        name: 'SLA Non Vie Togo',
        acronym: 'SLA',
        IsoCode: '0021',
        type_institution_id: 5,
      },
      object_id: 6,
      object: {
        libelle: "Divulgation d'informations",
        description: 'S.O',
        security_level_id: 5,
        duration_treatment_id: 4,
        category_id: 14,
      },
      customer_id: 10,
      customer: {
        id: 10,
        person: {
          nom: 'TAIO',
          prenom: 'Sylvain',
          sexe: 'M',
          ville: 'Cotonou',
          telephone: '+22966323542',
          email: 'sylvtaio@gmail.com',
        },
        account_number: 'BJ000456789',
        customer_type_id: 3,
        customer_type: {
          libelle: 'Personne physique',
        },
      },
    },
    {
      reference: null,
      location_event: 'Description',
      id: 4,
      description: 'Description',
      expect: "J'attends votre réponse avec des détails plus claires",
      amount: 2000,
      is_reminder: true,
      date_event: '2024-01-24T16:00:42Z',
      reception_channel_id: 7,
      reception_channel: {
        libelle: 'MOBILE',
      },
      response_channel_id: 1,
      response_channel: {
        libelle: 'SMS',
      },
      currency_id: 4,
      currency: {
        libelle: 'FCFA',
      },
      status_id: 2,
      status: {
        libelle: 'INCOMPLET',
      },
      type_id: 9,
      type: {
        libelle: "Erreur sur attestation d'assurance",
      },
      institution_id: 4,
      institution: {
        name: 'SLA Non Vie Togo',
        acronym: 'SLA',
        IsoCode: '0021',
        type_institution_id: 5,
      },
      object_id: 6,
      object: {
        libelle: "Divulgation d'informations",
        description: 'S.O',
        security_level_id: 5,
        duration_treatment_id: 4,
        category_id: 14,
      },
      customer_id: 10,
      customer: {
        id: 10,
        person: {
          nom: 'TAIO',
          prenom: 'Sylvain',
          sexe: 'M',
          ville: 'Cotonou',
          telephone: '+22966323542',
          email: 'sylvtaio@gmail.com',
        },
        account_number: 'BJ000456789',
        customer_type_id: 3,
        customer_type: {
          libelle: 'Personne physique',
        },
      },
    },
    {
      reference: null,
      location_event: 'Description',
      id: 5,
      description: 'Description',
      expect: "J'attends votre réponse avec des détails plus claires",
      amount: 2000,
      is_reminder: true,
      date_event: '2024-01-24T16:00:42Z',
      reception_channel_id: 7,
      reception_channel: {
        libelle: 'MOBILE',
      },
      response_channel_id: 1,
      response_channel: {
        libelle: 'SMS',
      },
      currency_id: 4,
      currency: {
        libelle: 'FCFA',
      },
      status_id: 2,
      status: {
        libelle: 'INCOMPLET',
      },
      type_id: 9,
      type: {
        libelle: "Erreur sur attestation d'assurance",
      },
      institution_id: 4,
      institution: {
        name: 'SLA Non Vie Togo',
        acronym: 'SLA',
        IsoCode: '0021',
        type_institution_id: 5,
      },
      object_id: 6,
      object: {
        libelle: "Divulgation d'informations",
        description: 'S.O',
        security_level_id: 5,
        duration_treatment_id: 4,
        category_id: 14,
      },
      customer_id: 10,
      customer: {
        id: 10,
        person: {
          nom: 'TAIO',
          prenom: 'Sylvain',
          sexe: 'M',
          ville: 'Cotonou',
          telephone: '+22966323542',
          email: 'sylvtaio@gmail.com',
        },
        account_number: 'BJ000456789',
        customer_type_id: 3,
        customer_type: {
          libelle: 'Personne physique',
        },
      },
    },
  ]);

  const goToClaimDetails = (data: ClaimModel | any) => {
    navigate('/claims/details/' + data.id);
  };

  const goToUpdate = (data: ClaimModel | any) => {
    navigate('/claims/update/' + data.id);
  };

  useEffect(() => {
    setclaimDatas(props._claimsDatas);
    console.log(props._claimsDatas);
  }, []);

  return (
    <>
      <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
        <thead>
          <tr className="border-0">
            <th className="p-0 min-w-200px w-50px fw-bolder text-left">Ref°</th>
            <th className="p-0 min-w-150px fw-bolder text-left">
              {intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' })}
            </th>
            <th className="p-0 min-w-150px fw-bolder text-left">
              {intl.formatMessage({ id: 'CLAIM.TYPE' })}
            </th>
            {/* <th className='p-0 min-w-150px fw-bolder text-right'>{intl.formatMessage({id: 'GEN.AMOUNT'})}</th> */}
            {/* <th className='p-0 min-w-150px fw-bolder text-center'>{intl.formatMessage({id: 'SETTINGS.STATUS'})}</th> */}
            {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.IS_REPEAT'})}</th> */}
            {/* <th className='p-0 min-w-150px fw-bolder text-left'>{intl.formatMessage({id: 'GEN.CUSTOMER'})}</th> */}
            <th className="p-0 min-w-50px fw-bolder text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {claimDatas?.map((row, index) => (
            <tr key={index} className="claim_item">
              <td className=" text-left">
                <div className="symbol symbol-45px me-2">
                  <h5>{row.reference}</h5>
                </div>
              </td>

              <td className=" text-left">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <h5>{row.object.libelle}</h5>
                </div>
              </td>

              <td className=" text-left">
                <div className="symbol symbol-45px me-2 text-hover-primary">
                  <h5>{row.type.libelle}</h5>
                </div>
              </td>

              {/* <td className=' text-right'>
                            <div className='symbol symbol-45px me-2 text-hover-primary'>
                                <h5>{row.amount} {row.currency.libelle}</h5>
                            </div>
                        </td> */}

              {/* <td className=' text-center'>
                            <div className='symbol symbol-45px me-2 text-hover-primary'>
                                <h5 className={'status-' + capitalizeStr(row.status.libelle)}>{capitalizeStr(row.status.libelle)}</h5>
                            </div>
                        </td> */}

              {/* <td className=' text-left'>
                            <div className='symbol symbol-45px me-2 text-hover-primary'>
                                <h5 className={row.is_reminder ? 'is-REMINDING' : 'no-REMINDING'}>{row.is_reminder ? capitalizeStr(intl.formatMessage({id: 'GEN.YES'})) : capitalizeStr(intl.formatMessage({id: 'GEN.NO'}))}</h5>
                            </div>
                        </td>

                        <td className=' text-left'>
                            <div className='symbol symbol-45px me-2 text-hover-primary'>
                                <a href='#'>
                                    <h5 className='text-primary'>{row.customer.account_number}</h5>
                                </a>
                            </div>
                        </td> */}

              <td className="text-left d-flex">
                <a
                  onClick={() => goToClaimDetails(row)}
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_2"
                  title={intl.formatMessage({ id: 'CLAIM.DETAILS' })}
                  className="btn btn-sm btn-icon btn-bg-light btn-color-primary"
                >
                  <KTIcon iconName="notepad" className="fs-1" />
                </a>

                <a
                  onClick={() => goToUpdate(row)}
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_2"
                  title={intl.formatMessage({ id: 'CLAIM.UPDATE' })}
                  className="btn btn-sm btn-icon btn-bg-light btn-color-warning ml-3"
                >
                  <KTIcon iconName="notepad-edit" className="fs-1" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export { MiniClaimsTable };
