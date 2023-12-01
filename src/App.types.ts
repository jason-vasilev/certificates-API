export interface ICertificate {
  id: number;
  combinedCertificates: ICombinedCertificates[];
}

export interface ICombinedCertificates {
  id: number;
  uniqueNumber: string;
  countryCode: string;
  companyName: string;
  validity: string;
  carbonCertificateOwnerAccount: {
    carbonUser: {
      company: {
        name: string;
        address: {
          country: string;
        };
      };
    };
  };
}
