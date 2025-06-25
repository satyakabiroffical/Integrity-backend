import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    favIcon: {
      type: String,
      trim: true,
    },
    privacyPolicy: {
      type: String,
      trim: true,
    },
    termsAndConditions: {
      type: String,
      trim: true,
    },
    aboutUs: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;

const defaultCreateCompany = async () => {
  const companyData = {
    name: "Integrity",
    phoneNumber: "+919111222403",
    email: "enquiry@integritymutualwealth.com",
    logo: "companyLogo.png",
    favIcon: "companyFavicon.png",
    address: "B-77 FIRST FLOOR BATA SHOWROOM SONAGIRI BHOPAL-462022",
    privacyPolicy: `
 At Integrity Mutual Funds, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our services related to mutual fund investments.

1. Information We Collect
We may collect the following types of personal information when you register, invest, or communicate with us:

Personal Information: Name, email address, contact number, date of birth, PAN card number, and address.
Financial Information: Bank details, income information, investment preferences, transaction history.
Usage Information: IP address, browser type, device info, and interaction behavior via cookies and analytics.
2. How We Use Your Information
To open and manage your mutual fund investment account.
To process transactions and provide statements.
To comply with regulatory/legal obligations (e.g., KYC/AML).
To improve website functionality and provide support.
To send important updates or communications (with your consent).
3. Sharing of Information
We do not sell or rent your personal data. We may share your information with:

Regulatory Authorities: SEBI, AMFI, etc., as required by law.
Third-Party Service Providers: KYC agencies, payment gateways, analytics tools.
Mutual Fund AMCs: For investment and redemption processing.
4. Data Security
We employ security practices like SSL encryption, access restrictions, and regular audits to protect your data. However, no system is entirely secure, and we advise users to be cautious when sharing sensitive information online.

5. Your Rights
Access and review your personal information.
Update or correct inaccuracies.
Opt out of marketing communications.
Request deletion of your account (as per compliance laws).
To exercise these rights, email us at Enquiry@integritymutualwealth.com.

6. Cookies Policy
We use cookies to personalize content and analyze traffic. You can manage cookie preferences in your browser settings, but some features may not work correctly if cookies are disabled.

7. Changes to This Policy
This policy may be updated from time to time. Any changes will be posted on this page with an updated effective date.

8. Contact Us
For questions or concerns regarding this policy, contact us at:
Integrity Mutual Funds
Email: Enquiry@integritymutualwealth.com
Phone: +91 9111222403
Address: B-77 FIRST FLOOR BATA SHOWROOM SONAGIRI BHOPAL-462022
    `,
    termsAndConditions:`Terms and Conditions

By accessing or investing through our Integrity mutual fund platform, you agree to the following terms and conditions. Integrity Mutual fund investments are subject to market risks. Past performance does not guarantee future results. Investors must read all scheme-related documents carefully before investing.

The information provided on this website is for general informational purposes only and does not constitute financial, investment, or tax advice. We recommend consulting a certified financial advisor before making any investment decisions.

You acknowledge that investment in Integrity mutual funds involves risks including the possible loss of principal. The value of investments may fluctuate and can go up or down depending on market conditions. We do not guarantee returns or the safety of your investment.

You are solely responsible for any decisions made based on the information provided. We shall not be liable for any loss or damage arising directly or indirectly from the use of our services. Use of our platform is at your own risk.

By continuing to use our services, you agree to receive transaction-related updates and promotional communication via email or SMS. These terms may be updated from time to time without prior notice.`
  };

  const existingCompany = await Company.countDocuments();
  if (!existingCompany) {
    await Company.create(companyData);
    console.log("Company created successfully");
  } else {
    console.log("Company already exists");
  }
};

export { defaultCreateCompany };
