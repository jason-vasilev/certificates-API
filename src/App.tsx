import React, { useEffect, useState } from "react";

import styles from "./App.module.css";

import { ICertificate } from "./App.types";

const DataComponent: React.FC = () => {
  const textCopyCertificateID = "Click to copy the certificate ID";
  const textCopiedCertificateID = "Certificate ID copied";

  const [certificateData, setData] = useState<ICertificate[]>([]);
  const [favoriteCertificates, setFavoriteCertificates] = useState<
    ICertificate[]
  >([]);
  const [toolTipText, setToolTipText] = useState(textCopyCertificateID);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          "https://demo.api.agreena.com/api/public/carbon_registry/v1/certificates?includeMeta=true&page=1&limit=10",
          {
            headers: {
              "API-ACCESS-TOKEN": "Commoditrader-React-FE-Farmer",
            },
          }
        );

        if (response.ok) {
          const fetchedData: { result: { data: ICertificate[] } } =
            await response.json();
          setData(fetchedData.result.data);
        } else {
          console.error("Failed to fetch certificates");
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, []);

  function handleCopyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setToolTipText(textCopiedCertificateID);
  }

  function resetToolTipText() {
    setToolTipText(textCopyCertificateID);
  }

  function handleAddToFavorites(
    event: React.MouseEvent<HTMLButtonElement>,
    favoriteCertificate: ICertificate
  ) {
    event.currentTarget.classList.toggle(styles.favoriteButtonActive);

    // Check if the favoriteCertificate already exists in the favoriteCertificates array
    const index = favoriteCertificates.findIndex(
      (certificate: ICertificate) => certificate.id === favoriteCertificate.id
    );

    // Add it to the array if it doesn't exist
    if (index === -1) {
      setFavoriteCertificates((prevFavorites) => [
        ...prevFavorites,
        favoriteCertificate,
      ]);
    } else {
      // Remove it from the array if it already exists there
      const updatedFavorites = favoriteCertificates.filter(
        (_, i) => i !== index
      );
      setFavoriteCertificates(updatedFavorites);
    }
  }

  return (
    <>
      <h1>Certificates</h1>

      {/* in best scenariou the table would be added as separate component to avoid repetition */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Unique ID</th>
            <th className={styles.tableHeader}>Originator</th>
            <th className={styles.tableHeader}>Originator country</th>
            <th className={styles.tableHeader}>Owner</th>
            <th className={styles.tableHeader}>Owner country</th>
            <th className={styles.tableHeader}>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {certificateData.map((item) => (
            <tr key={item.id} className={styles.tableRow}>
              <td className={styles.tableCell} data-th="Unique ID">
                {/* in best scenariou the buttons would be added as a separate component */}
                <button
                  className={styles.certificateButton}
                  onClick={() => handleCopyToClipboard(item.uniqueNumber)}
                  onMouseOut={() => resetToolTipText()}
                >
                  <span className={styles.tooltipText}>{toolTipText}</span>
                  {item.uniqueNumber}
                </button>
              </td>
              {/* data-th used for mobile solution */}
              <td className={styles.tableCell} data-th="Originator">
                {item.companyName}
              </td>
              <td className={styles.tableCell} data-th="Originator country">
                {item.countryCode}
              </td>
              <td className={styles.tableCell} data-th="Owner">
                {item.companyName}
              </td>
              <td className={styles.tableCell} data-th="Owner country">
                {
                  item.carbonCertificateOwnerAccount.carbonUser.company.address
                    .country
                }
              </td>
              <td className={styles.tableCell} data-th="Status">
                {item.validity}
              </td>
              <td className={styles.tableCell} data-th="Favorite">
                {/* button could be loaded as separate componentn */}
                <button
                  className={styles.favoriteButton}
                  onClick={(event) => handleAddToFavorites(event, item)}
                >
                  <svg viewBox="0 0 32 32" width="32px" height="32px">
                    <polygon
                      fill="none"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      points="24,6 8,6 8,26 16,20 24,26 "
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* conditional logic could show different view inviting users to add certificates to favorites, when the list is initially empty */}
      {favoriteCertificates.length > 0 && (
        <>
          <h2>Favorite certificates</h2>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Unique ID</th>
                <th className={styles.tableHeader}>Originator</th>
                <th className={styles.tableHeader}>Originator country</th>
                <th className={styles.tableHeader}>Owner</th>
                <th className={styles.tableHeader}>Owner country</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {favoriteCertificates.map((item) => (
                <tr key={item.id} className={styles.tableRow}>
                  <td className={styles.tableCell} data-th="Unique ID">
                    <button
                      className={styles.certificateButton}
                      onClick={() => handleCopyToClipboard(item.uniqueNumber)}
                      onMouseOut={() => resetToolTipText()}
                    >
                      <span className={styles.tooltipText}>{toolTipText}</span>
                      {item.uniqueNumber}
                    </button>
                  </td>
                  <td className={styles.tableCell} data-th="Originator">
                    {item.companyName}
                  </td>
                  <td className={styles.tableCell} data-th="Originator country">
                    {item.countryCode}
                  </td>
                  <td className={styles.tableCell} data-th="Owner">
                    {
                      item.carbonCertificateOwnerAccount.carbonUser.company
                        .address.companyName
                    }
                  </td>
                  <td className={styles.tableCell} data-th="Owner country">
                    {
                      item.carbonCertificateOwnerAccount.carbonUser.company
                        .address.country
                    }
                  </td>
                  <td className={styles.tableCell} data-th="Status">
                    {item.validity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default DataComponent;
