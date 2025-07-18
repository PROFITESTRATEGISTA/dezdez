import React from 'react';

interface NAPProps {
  businessName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  phoneNumber: string;
  email?: string;
  className?: string;
}

const NAP: React.FC<NAPProps> = ({
  businessName,
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
  phoneNumber,
  email,
  className = ''
}) => {
  return (
    <div className={`nap-container ${className}`} itemScope itemType="https://schema.org/LocalBusiness">
      <h3 className="text-lg font-semibold mb-2" itemProp="name">{businessName}</h3>
      <div className="address" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
        <p className="mb-1">
          <span itemProp="streetAddress">{streetAddress}</span><br />
          <span itemProp="addressLocality">{addressLocality}</span>, <span itemProp="addressRegion">{addressRegion}</span> <span itemProp="postalCode">{postalCode}</span><br />
          <span itemProp="addressCountry">Brasil</span>
        </p>
      </div>
      <div className="contact mt-2">
        <p className="mb-1">
          <span>Telefone: </span>
          <a href={`tel:${phoneNumber.replace(/\D/g, '')}`} itemProp="telephone">{phoneNumber}</a>
        </p>
        {email && (
          <p className="mb-1">
            <span>Email: </span>
            <a href={`mailto:${email}`} itemProp="email">{email}</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default NAP;