import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export const metadata: Metadata = {
  title: "Terms of Service — TokenMart",
  description:
    "Console Service Agreement for inference.ai — terms and conditions governing access to and use of the Platform.",
};

export default function TermsAndServicesPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <header className="flex justify-center pt-4">
        <Navbar fixed={false} />
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-10 pt-10 pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-12 hover:opacity-80 transition-opacity"
          style={{ color: "var(--color-text-dim)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <p
          className="text-sm font-semibold tracking-widest mb-4"
          style={{ color: "var(--color-text-dim)" }}
        >
          INFERENCE.AI
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
          Console Service Agreement
        </h1>
        <p className="text-sm mb-16" style={{ color: "var(--color-text-muted)" }}>
          Effective Date: 4/19/2026
        </p>

        <div
          className="space-y-8 text-base leading-relaxed"
          style={{ color: "var(--color-text-dim)" }}
        >
          <p>
            This Console Service Agreement (this &ldquo;Agreement&rdquo;) is
            entered into between Distribyte Inc., a Delaware corporation doing
            business as inference.ai (&ldquo;Company&rdquo;), and the individual
            or entity accessing or using the Services (&ldquo;Client&rdquo;).
            This Agreement is effective upon the earlier of: (a) Client&rsquo;s
            electronic acceptance of this Agreement, (b) the Effective Date of
            signatures by client, or (c) Client&rsquo;s first access to or use
            of the Services (the &ldquo;Effective Date&rdquo;).
          </p>

          <p
            className="font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            PLEASE READ THIS AGREEMENT CAREFULLY. BY CLICKING &ldquo;I
            ACCEPT&rdquo; OR BY ACCESSING OR USING THE SERVICES, CLIENT
            ACKNOWLEDGES THAT IT HAS READ, UNDERSTOOD, AND AGREES TO BE BOUND BY
            THIS AGREEMENT. IF CLIENT DOES NOT AGREE, CLIENT MUST NOT ACCESS OR
            USE THE SERVICES.
          </p>

          <p
            className="font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            THIS AGREEMENT CONTAINS A MANDATORY ARBITRATION PROVISION AND CLASS
            ACTION WAIVER IN SECTION 14.2. BY ACCEPTING THIS AGREEMENT, CLIENT
            WAIVES ITS RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN ANY CLASS OR
            REPRESENTATIVE ACTION PROCEEDING.
          </p>
        </div>

        <Section number="1" title="Definitions">
          <p>
            As used in this Agreement, the following terms have the meanings set
            forth below:
          </p>
          <Clause id="1.1" term="AI Models">
            means the third-party artificial intelligence and machine learning
            models made accessible through the Platform.
          </Clause>
          <Clause id="1.2" term="APIs">
            means the application programming interfaces through which Client
            accesses AI Models via the Platform.
          </Clause>
          <Clause id="1.3" term="Acceptable Use Policy" altTerm="AUP">
            means the policy governing permitted and prohibited uses of the
            Services, as published by Company at console.inference.ai/aup and
            updated from time to time in accordance with Section 14.5.
          </Clause>
          <Clause id="1.4" term="Confidential Information">
            has the meaning set forth in Section 13.1.
          </Clause>
          <Clause
            id="1.5"
            term="Data Processing Agreement"
            altTerm="DPA"
          >
            means the data processing agreement governing Company&rsquo;s
            processing of personal data on Client&rsquo;s behalf, as made
            available at console.inference.ai/dpa and incorporated herein by
            reference.
          </Clause>
          <Clause id="1.6" term="Feedback">
            has the meaning set forth in Section 12.3.
          </Clause>
          <Clause id="1.7" term="Input">
            means any data, text, images, files, or other content submitted by
            Client to the Services.
          </Clause>
          <Clause id="1.8" term="Order Form">
            means a written service order executed by both parties that
            specifies commercial terms (including authorized AI Models, pricing,
            and service term) and is incorporated into this Agreement.
          </Clause>
          <Clause id="1.9" term="Output">
            means any content generated by AI Models in response to
            Client&rsquo;s Input.
          </Clause>
          <Clause id="1.10" term="Platform">
            means the Company&rsquo;s website at console.inference.ai and
            related systems, infrastructure, and software operated by Company.
          </Clause>
          <Clause id="1.11" term="Privacy Policy">
            means Company&rsquo;s privacy policy governing the collection, use,
            and disclosure of personal information, as published at
            console.inference.ai/privacy and incorporated herein by reference.
          </Clause>
          <Clause id="1.12" term="Services">
            means the Platform and Company&rsquo;s provision of access to
            third-party AI Models and APIs.
          </Clause>
          <Clause id="1.13" term="Upstream Provider">
            means any third-party developer, operator, or provider of AI Models
            or APIs accessible through the Platform, including without
            limitation Anthropic, PBC; OpenAI, LLC; Microsoft Corporation (Azure
            OpenAI); Google LLC; and their respective affiliates.
          </Clause>
          <Clause id="1.14" term="Upstream Provider Terms">
            means the terms of service, acceptable use policies, usage
            guidelines, and other agreements of each Upstream Provider
            applicable to access to and use of that provider&rsquo;s AI Models
            or APIs.
          </Clause>
          <Clause id="1.15" term="User Content">
            means, collectively, Input and Output.
          </Clause>
          <Clause id="1.16" term="Vendor Products">
            means AI Models, APIs, and any other third-party products or
            services accessible through the Platform.
          </Clause>
          <Clause id="1.17" term="Credits">
            means any prepaid tokens or credits purchased by Client for use of
            the Services, as further described in Section 7.8.
          </Clause>
          <Clause id="1.18" term="Red Teaming">
            means any adversarial prompt injection, jailbreaking, prompt
            exploitation, model manipulation, or other intentional attempt to
            cause an AI Model to behave contrary to its intended design or
            Upstream Provider Terms.
          </Clause>
        </Section>

        <Section number="2" title="Service Overview; Company's Role">
          <Subsection id="2.1" title="Platform Description">
            <p>
              Company operates an AI model aggregation platform that enables
              Client to access third-party AI Models and APIs via the Platform.
              Company may add, modify, or remove AI Models from the Platform at
              any time without prior notice, subject to Section 2.3.
            </p>
          </Subsection>
          <Subsection id="2.2" title="Intermediary Role">
            <p>
              <strong style={{ color: "var(--color-text)" }}>
                CLIENT EXPRESSLY ACKNOWLEDGES AND AGREES THAT COMPANY ACTS
                SOLELY AS A TECHNICAL INTERMEDIARY
              </strong>{" "}
              providing access to third-party Vendor Products. Company:
            </p>
            <NumberedList>
              <li>
                <strong>2.2.1</strong> does not develop, own, operate, or
                control any AI Models or APIs accessible through the Platform;
              </li>
              <li>
                <strong>2.2.2</strong> does not monitor, review, or assume
                responsibility for any User Content, Outputs, or the performance
                of any Vendor Products;
              </li>
              <li>
                <strong>2.2.3</strong> does not warrant, guarantee, or make any
                representations regarding the accuracy, reliability, legality,
                or fitness for any particular purpose of any Vendor Products or
                Outputs; and
              </li>
              <li>
                <strong>2.2.4</strong> has no obligation to verify the
                compliance of any Vendor Products with applicable laws or
                regulations.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection
            id="2.3"
            title="Critical Disclosure: Upstream Provider Dependency and Model Availability"
          >
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              CLIENT EXPRESSLY ACKNOWLEDGES AND AGREES TO THE FOLLOWING:
            </p>
            <NumberedList>
              <li>
                <strong>2.3.1 Provider Dependency.</strong> Company&rsquo;s
                ability to provide access to any AI Model depends entirely on
                the continued authorization and cooperation of the applicable
                Upstream Provider. Each Upstream Provider independently controls
                access to its AI Models and may restrict, suspend, revoke, or
                terminate Company&rsquo;s access to its models or APIs at any
                time, with or without notice to Company or Client, for any
                reason or no reason, including changes in Upstream Provider
                policies, business decisions, or determination that
                Company&rsquo;s or Client&rsquo;s use violates Upstream Provider
                Terms.
              </li>
              <li>
                <strong>2.3.2 No Guarantee of Model Availability.</strong>{" "}
                Company makes no representation or warranty that any specific
                AI Model &mdash; including any model currently listed on the
                Platform or referenced in any Order Form &mdash; will remain
                available for any period of time. Any Upstream Provider action
                restricting or terminating access to a model, including models
                named in an Order Form, shall not constitute a breach of this
                Agreement by Company and shall not give rise to any refund,
                credit, liability, or other remedy against Company, except as
                to unused prepaid credits as provided in Section 7.8.
              </li>
              <li>
                <strong>2.3.3 No Endorsement.</strong> Company&rsquo;s inclusion
                of any AI Model on the Platform does not constitute
                Company&rsquo;s endorsement, certification, or recommendation
                of such AI Model or its outputs.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection id="2.4" title="Upstream Provider Terms">
            <p>
              Client&rsquo;s use of each AI Model is subject to the applicable
              Upstream Provider Terms. A non-exhaustive list of Upstream
              Provider Terms is made available at
              console.inference.ai/provider-terms. Client is solely responsible
              for reviewing and complying with all applicable Upstream Provider
              Terms. Company is not liable for any errors, omissions, or
              misrepresentations in any Upstream Provider Terms, and
              Company&rsquo;s failure to provide accurate or current links to
              Upstream Provider Terms shall not relieve Client of its compliance
              obligations.
            </p>
          </Subsection>
        </Section>

        <Section number="3" title="Client Obligations and Responsibilities">
          <Subsection id="3.1" title="Legal Compliance">
            <p>
              Client is solely responsible for ensuring that its use of the
              Services complies with all applicable laws, regulations, and
              industry standards in all jurisdictions where Client operates,
              including without limitation laws relating to data protection,
              privacy, artificial intelligence, export controls, and sanctions.
            </p>
          </Subsection>
          <Subsection id="3.2" title="Upstream Provider Terms Compliance">
            <p>
              Client shall comply with all applicable Upstream Provider Terms
              in connection with Client&rsquo;s use of the Services.
              Client&rsquo;s obligations include, without limitation:
            </p>
            <NumberedList>
              <li>
                <strong>3.2.1</strong> reviewing and monitoring Upstream
                Provider Terms for each AI Model Client uses through the
                Platform, as such terms may be updated from time to time;
              </li>
              <li>
                <strong>3.2.2</strong> configuring any available opt-out
                settings (including, where available, model training opt-outs)
                in accordance with applicable Upstream Provider Terms; and
              </li>
              <li>
                <strong>3.2.3</strong> ensuring that Client&rsquo;s end users
                comply with applicable Upstream Provider Terms to the same
                extent as Client.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection id="3.3" title="Upstream Provider Indemnification">
            <p>
              If Client&rsquo;s use of the Services, or Client&rsquo;s
              direction, instruction, or enablement of any third party&rsquo;s
              use of the Services, causes, contributes to, or is alleged to
              have caused an Upstream Provider to take any action against
              Company, including without limitation: (a) terminating or
              restricting Company&rsquo;s API access; (b) imposing penalties,
              usage restrictions, or additional fees on Company; (c) asserting
              claims or initiating legal proceedings against Company; or (d)
              requiring Company to indemnify or compensate the Upstream
              Provider, then Client shall indemnify, defend, and hold harmless
              Company from all resulting costs, losses, damages, liabilities,
              and expenses, including reasonable attorneys&rsquo; fees. This
              obligation is in addition to and does not limit Client&rsquo;s
              indemnification obligations under Section 11.
            </p>
          </Subsection>
          <Subsection id="3.4" title="Data Responsibility">
            <p>Client shall:</p>
            <NumberedList>
              <li>
                <strong>3.4.1</strong> implement appropriate technical and
                organizational measures to safeguard the security and
                confidentiality of all data processed through the Services;
              </li>
              <li>
                <strong>3.4.2</strong> obtain all necessary consents,
                authorizations, and permissions from end-users, data subjects,
                and other relevant parties prior to submitting any data to the
                Services;
              </li>
              <li>
                <strong>3.4.3</strong> maintain all records required by
                applicable law in connection with Client&rsquo;s use of the
                Services; and
              </li>
              <li>
                <strong>3.4.4</strong> ensure that all Input complies with
                applicable laws and does not infringe any third-party rights.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection id="3.5" title="Data Processing; Privacy">
            <p>
              Client acknowledges that Client is the data controller of any
              personal data contained in Client&rsquo;s Inputs. Company
              processes such personal data on Client&rsquo;s behalf as a data
              processor. The parties&rsquo; respective data protection
              obligations are governed by the DPA, which is incorporated into
              this Agreement by reference. Client&rsquo;s use of the Services
              constitutes Client&rsquo;s acceptance of the DPA. Company&rsquo;s
              collection and use of personal information relating to
              Client&rsquo;s account is governed by the Privacy Policy, which
              is incorporated into this Agreement by reference.
            </p>
          </Subsection>
          <Subsection id="3.6" title="Account Security">
            <p>
              Client is solely responsible for maintaining the confidentiality
              and security of all API keys, access credentials, passwords, and
              account information. Client shall:
            </p>
            <NumberedList>
              <li>
                <strong>3.6.1</strong> implement commercially reasonable
                security measures to protect its credentials from unauthorized
                access or disclosure;
              </li>
              <li>
                <strong>3.6.2</strong> immediately notify Company at
                support@inference.ai upon becoming aware of any actual or
                suspected unauthorized access to Client&rsquo;s account or
                credentials; and
              </li>
              <li>
                <strong>3.6.3</strong> accept sole responsibility for all
                activity, usage, and charges incurred under Client&rsquo;s
                account and credentials, whether or not authorized by Client.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection id="3.7" title="Content Moderation">
            <p>
              Client is solely responsible for reviewing, moderating, and
              ensuring the compliance of all User Content with applicable laws,
              Upstream Provider Terms, the AUP, and this Agreement. Company has
              no obligation to monitor or moderate User Content.
            </p>
          </Subsection>
        </Section>

        <Section number="4" title="User Content">
          <Subsection id="4.1" title="Ownership of Input">
            <p>
              Client retains all intellectual property rights in and to the
              Input that Client submits to the Services, subject to the licenses
              granted herein.
            </p>
          </Subsection>
          <Subsection id="4.2" title="Ownership of Output">
            <p>
              Client&rsquo;s rights in any Output are governed by the applicable
              Upstream Provider Terms of the third-party provider that generated
              such Output. Company makes no representations or warranties
              regarding Client&rsquo;s ownership or usage rights in any Output.
              Client is solely responsible for reviewing applicable Upstream
              Provider Terms to understand any rights or restrictions applicable
              to Output.
            </p>
          </Subsection>
          <Subsection id="4.3" title="Model Training">
            <p>
              Some AI Models may store, process, or use Client&rsquo;s Input for
              purposes of improving or training such AI Models, as described in
              the applicable Upstream Provider Terms. Client is solely
              responsible for reviewing applicable Upstream Provider Terms and,
              where available, configuring opt-out settings. Company has no
              control over third-party training practices and makes no
              representation as to whether any particular Upstream Provider does
              or does not train on Client&rsquo;s Input. Where Company is aware
              of default training-on settings for specific models, Company will
              endeavor to disclose such information at
              console.inference.ai/provider-terms, but Client should not rely
              solely on Company&rsquo;s disclosures and is encouraged to review
              Upstream Provider Terms directly.
            </p>
          </Subsection>
          <Subsection id="4.4" title="License to Company">
            <p>
              Client grants Company a worldwide, non-exclusive, royalty-free
              license to host, store, transmit, display, and reproduce User
              Content solely as necessary to provide the Services and for system
              maintenance, debugging, and service improvement purposes. This
              license terminates upon deletion of User Content by Client or upon
              termination of this Agreement, subject to any retention
              obligations under applicable law or as described in the Privacy
              Policy.
            </p>
          </Subsection>
          <Subsection id="4.5" title="Content Representations">
            <p>Client represents and warrants that:</p>
            <NumberedList>
              <li>
                <strong>4.5.1</strong> Client owns or has obtained all necessary
                rights, licenses, and permissions to submit the Input to the
                Services and to grant the licenses set forth in this Agreement;
              </li>
              <li>
                <strong>4.5.2</strong> the Input does not infringe,
                misappropriate, or violate any intellectual property, privacy,
                publicity, or other rights of any third party;
              </li>
              <li>
                <strong>4.5.3</strong> the Input does not contain any content
                that is unlawful, harmful, threatening, defamatory, obscene, or
                otherwise objectionable; and
              </li>
              <li>
                <strong>4.5.4</strong> Client&rsquo;s use of the Services and
                User Content complies with all applicable laws, Upstream
                Provider Terms, and the AUP.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection
            id="4.6"
            title="AI Output Risks — Client Acknowledgment"
          >
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              CLIENT EXPRESSLY ACKNOWLEDGES AND AGREES THAT:
            </p>
            <NumberedList>
              <li>
                <strong>4.6.1</strong> AI-generated Outputs may contain factual
                inaccuracies, errors, omissions, hallucinations, biased content,
                outdated information, or content that is inappropriate or
                unsuitable for Client&rsquo;s specific use case;
              </li>
              <li>
                <strong>4.6.2</strong> Outputs are generated by third-party AI
                Models that Company does not develop, operate, or control, and
                Company cannot verify the accuracy, completeness, or
                appropriateness of any Output;
              </li>
              <li>
                <strong>4.6.3</strong> Client shall not rely on any Output for
                legal, medical, financial, safety-critical, or regulated
                decision-making without independent human review and
                verification by qualified professionals;
              </li>
              <li>
                <strong>4.6.4</strong> Company is not responsible for any
                decisions made, actions taken, or consequences arising from
                Client&rsquo;s reliance on any Output; and
              </li>
              <li>
                <strong>4.6.5</strong> the legal status of AI-generated content,
                including questions of copyright, ownership, and regulatory
                compliance, varies by jurisdiction and is subject to ongoing
                legal and regulatory development; Company makes no
                representations regarding the legal status of any Output in
                Client&rsquo;s jurisdiction.
              </li>
            </NumberedList>
          </Subsection>
        </Section>

        <Section number="5" title="Prohibited Conduct">
          <p>
            Client agrees not to, and shall not permit any third party to:
          </p>
          <NumberedList>
            <li>
              <strong>5.1</strong> use the Services for any unlawful purpose or
              in violation of any applicable law, regulation, Upstream Provider
              Terms, or the AUP;
            </li>
            <li>
              <strong>5.2</strong> submit Input that infringes any intellectual
              property rights, privacy rights, or other rights of any third
              party;
            </li>
            <li>
              <strong>5.3</strong> use the Services to generate content that is
              harmful, threatening, abusive, defamatory, obscene, or otherwise
              objectionable or in violation of applicable Upstream Provider
              Terms;
            </li>
            <li>
              <strong>5.4</strong> attempt to circumvent any usage limits, rate
              limits, billing mechanisms, content filters, safety measures, or
              other technical restrictions;
            </li>
            <li>
              <strong>5.5</strong> create false identities, misrepresent
              identity, or create multiple accounts to bypass restrictions;
            </li>
            <li>
              <strong>5.6</strong> engage in Red Teaming (as defined in Section
              1.18) without Company&rsquo;s prior written approval as set forth
              in Section 6;
            </li>
            <li>
              <strong>5.7</strong> reverse engineer, decompile, disassemble, or
              otherwise attempt to derive source code from the Services or any
              Vendor Products;
            </li>
            <li>
              <strong>5.8</strong> use automated means (including bots,
              scrapers, or crawlers) to access the Services except through
              authorized APIs;
            </li>
            <li>
              <strong>5.9</strong> interfere with or disrupt the integrity,
              security, or performance of the Services or any related systems;
            </li>
            <li>
              <strong>5.10</strong> access accounts, systems, or data without
              authorization;
            </li>
            <li>
              <strong>5.11</strong> resell, sublicense, redistribute, or
              otherwise transfer access to the Services or the benefit of any
              API key or credential, except as expressly authorized in writing
              by Company;
            </li>
            <li>
              <strong>5.12</strong> use the Services in any manner that violates
              or would cause Company to violate any Upstream Provider Terms; or
            </li>
            <li>
              <strong>5.13</strong> assist or enable any third party to engage
              in any of the foregoing prohibited activities.
            </li>
          </NumberedList>
        </Section>

        <Section number="6" title="Red Teaming">
          <p>
            Red Teaming (as defined in Section 1.18) violates the terms of most
            Upstream Providers and may result in immediate termination of
            Company&rsquo;s API access. Company permits Red Teaming only for
            legitimate, documented security research purposes and only with
            prior written approval. To request authorization:
          </p>
          <NumberedList>
            <li>
              <strong>6.1</strong> Client must submit a written request to
              security@inference.ai describing the nature and scope of the
              proposed activity, the AI Models targeted, the research
              methodology, and the intended use of results;
            </li>
            <li>
              <strong>6.2</strong> Company will review each request and respond
              in writing, typically within five (5) business days. Approval is
              granted in Company&rsquo;s sole discretion and is not guaranteed;
            </li>
            <li>
              <strong>6.3</strong> Any approved Red Teaming must be conducted
              solely within the scope of the written approval; and
            </li>
            <li>
              <strong>6.4</strong> Unauthorized Red Teaming constitutes a
              material breach of this Agreement and will result in immediate
              suspension or termination of Client&rsquo;s access without
              liability to Company.
            </li>
          </NumberedList>
          <p className="font-semibold" style={{ color: "var(--color-text)" }}>
            CLIENT ACKNOWLEDGES THAT UNAUTHORIZED RED TEAMING IS LIKELY TO
            TRIGGER AUTOMATIC DETECTION AND TERMINATION BY UPSTREAM PROVIDERS,
            WHICH MAY IMMEDIATELY AND PERMANENTLY IMPAIR COMPANY&rsquo;S ABILITY
            TO PROVIDE SERVICES TO ALL CLIENTS.
          </p>
        </Section>

        <Section number="7" title="Payment Terms">
          <Subsection id="7.1" title="Fees">
            <p>
              Client shall pay all fees for use of the Services as set forth in
              the applicable Order Form or as displayed on the Platform. All
              fees are quoted and payable in United States Dollars (USD) unless
              otherwise specified in an Order Form.
            </p>
          </Subsection>
          <Subsection id="7.2" title="Billing and Invoicing">
            <p>
              Company shall issue invoices to Client on a monthly basis (or as
              otherwise specified in the applicable Order Form) for actual
              usage during the preceding billing period. Client shall pay all
              undisputed invoiced amounts within thirty (30) calendar days of
              receipt of invoice.
            </p>
          </Subsection>
          <Subsection id="7.3" title="Late Payment">
            <p>If Client fails to pay any undisputed amount when due:</p>
            <NumberedList>
              <li>
                <strong>7.3.1</strong> Client shall pay interest on overdue
                amounts at the rate of one and one-half percent (1.5%) per
                month, or the maximum rate permitted by applicable law,
                whichever is lower, accruing from the due date;
              </li>
              <li>
                <strong>7.3.2</strong> Company may, upon written notice,
                suspend Client&rsquo;s access to the Services without
                liability, provided Company will restore access upon receipt of
                payment in full;
              </li>
              <li>
                <strong>7.3.3</strong> Company may terminate this Agreement
                upon written notice as provided in Section 8.3; and
              </li>
              <li>
                <strong>7.3.4</strong> Client shall reimburse Company for all
                reasonable costs of collection, including attorneys&rsquo;
                fees, to the extent permitted by applicable law.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection id="7.4" title="Taxes">
            <p>
              All fees are exclusive of applicable taxes, duties, and
              governmental charges. Client shall be responsible for all such
              amounts, excluding taxes based solely on Company&rsquo;s net
              income. If Company is required by law to withhold or collect any
              taxes, Company will invoice Client for such amounts, and Client
              shall pay them as part of the applicable invoice.
            </p>
          </Subsection>
          <Subsection id="7.5" title="No Set-Off">
            <p>
              Client shall not withhold or set off any amounts due under this
              Agreement against any claims, counterclaims, or disputes, except
              as otherwise required by applicable law.
            </p>
          </Subsection>
          <Subsection id="7.6" title="Usage Records; Dispute Procedure">
            <p>
              Company&rsquo;s usage records shall serve as the primary basis
              for billing. If Client has a good-faith dispute regarding any
              portion of an invoice, Client shall:
            </p>
            <NumberedList>
              <li>
                <strong>7.6.1</strong> notify Company in writing of the specific
                amounts disputed and the basis for the dispute within thirty
                (30) days of receipt of the applicable invoice;
              </li>
              <li>
                <strong>7.6.2</strong> pay all undisputed amounts by the
                applicable due date; and
              </li>
              <li>
                <strong>7.6.3</strong> cooperate with Company in good faith to
                resolve the dispute within thirty (30) days following
                Company&rsquo;s receipt of the dispute notice.
              </li>
            </NumberedList>
            <p>
              If the parties are unable to resolve the dispute within the
              foregoing period, either party may escalate the dispute in
              accordance with Section 14.2. Failure by Client to provide timely
              written notice of a dispute shall constitute Client&rsquo;s
              acceptance of the invoice as accurate. Client may request, no
              more than once per calendar year, an audit of usage records by a
              mutually agreed independent auditor, at Client&rsquo;s expense,
              upon thirty (30) days&rsquo; prior written notice.
            </p>
          </Subsection>
          <Subsection id="7.7" title="Price Changes">
            <p>
              Company reserves the right to modify pricing for the Services.
              Company shall provide Client at least thirty (30) days&rsquo;
              prior written notice of any price increase. For clients with a
              signed Order Form, pricing is fixed for the current Order Form
              term; price changes will apply only upon renewal of the applicable
              Order Form. Client&rsquo;s continued use of the Services following
              any price change constitutes acceptance of such change.
            </p>
          </Subsection>
          <Subsection id="7.8" title="Prepaid Credits">
            <p>
              If Client purchases prepaid credits or tokens
              (&ldquo;Credits&rdquo;) for use of the Services: (a) Credits are
              non-transferable, non-assignable, and have no cash value; (b)
              Credits may not be resold or transferred to third parties; (c)
              the expiration and refund terms applicable to Credits shall be as
              set forth in the applicable Order Form or as displayed on the
              Platform at time of purchase; and (d) upon termination of this
              Agreement by Company for Client&rsquo;s breach or by Client for
              convenience, any unused Credits shall be treated as set forth in
              Section 8.4.
            </p>
          </Subsection>
          <Subsection id="7.9" title="Token Value; No Liability for Changes">
            <p>
              The value of Credits or tokens is determined solely by Company
              and is subject to change. Company reserves the right to adjust
              the token value, conversion rates, or pricing of Credits at any
              time upon notice as provided in Section 7.7. Company shall have
              no liability to Client arising from any change in token value,
              conversion rates, or the purchasing power of Credits, including
              without limitation any reduction in the number of API calls,
              tokens, or model interactions available for a given Credit
              balance following a pricing adjustment. Client&rsquo;s sole
              remedy for any such change shall be to terminate this Agreement
              for convenience in accordance with Section 8.2.
            </p>
          </Subsection>
        </Section>

        <Section number="8" title="Term and Termination">
          <Subsection id="8.1" title="Term">
            <p>
              This Agreement commences on the Effective Date and continues
              until terminated in accordance with this Section 8.
            </p>
          </Subsection>
          <Subsection id="8.2" title="Termination for Convenience">
            <p>
              Either party may terminate this Agreement upon thirty (30)
              days&rsquo; prior written notice to the other party. For the
              avoidance of doubt, Client&rsquo;s termination for convenience
              does not entitle Client to any refund of prepaid Credits or fees
              for Services not yet consumed, except as set forth in Section 8.4.
            </p>
          </Subsection>
          <Subsection id="8.3" title="Termination for Cause">
            <p>
              Company may suspend or terminate this Agreement and Client&rsquo;s
              access to the Services immediately upon written notice if:
            </p>
            <NumberedList>
              <li>
                <strong>8.3.1</strong> Client fails to pay any undisputed
                amount when due and such failure continues for five (5) days
                after written notice;
              </li>
              <li>
                <strong>8.3.2</strong> Client breaches any material term of
                this Agreement and, where the breach is curable, fails to cure
                such breach within ten (10) days after written notice;
              </li>
              <li>
                <strong>8.3.3</strong> Client engages in any prohibited conduct
                under Section 5, including unauthorized Red Teaming;
              </li>
              <li>
                <strong>8.3.4</strong> Client violates any Upstream Provider
                Terms in a manner that causes or threatens to cause adverse
                action against Company by an Upstream Provider;
              </li>
              <li>
                <strong>8.3.5</strong> Client&rsquo;s use of the Services poses
                a security risk, creates legal exposure for Company, or may
                result in liability for Company; or
              </li>
              <li>
                <strong>8.3.6</strong> Client becomes insolvent, makes an
                assignment for the benefit of creditors, files for bankruptcy
                protection, or ceases operations.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection id="8.4" title="Effect of Termination">
            <p>Upon termination or expiration of this Agreement:</p>
            <NumberedList>
              <li>
                <strong>8.4.1</strong> Client shall immediately cease all use
                of the Services;
              </li>
              <li>
                <strong>8.4.2</strong> Client shall pay all outstanding fees
                for Services rendered through the termination date;
              </li>
              <li>
                <strong>8.4.3</strong> Company may delete all Client data and
                User Content thirty (30) days following the termination date,
                subject to any data retention obligations under applicable law
                or the DPA;
              </li>
              <li>
                <strong>8.4.4</strong> if this Agreement is terminated by
                Company for cause under Section 8.3, any unused prepaid Credits
                shall be forfeited; and
              </li>
              <li>
                <strong>8.4.5</strong> if this Agreement is terminated by
                Company for convenience or by Client for cause, Company shall
                refund any unused prepaid Credits on a pro-rata basis within
                thirty (30) days.
              </li>
              <li>
                <strong>8.4.6</strong> the provisions of Sections 2.3, 3.3,
                4.4, 4.6, 6, 7, 9, 10, 11, 12, 13, and 14 shall survive
                termination.
              </li>
            </NumberedList>
          </Subsection>
        </Section>

        <Section number="9" title="Disclaimers; No Warranties">
          <Subsection id="9.1" title="As-Is Basis">
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              THE SERVICES, PLATFORM, AND ALL VENDOR PRODUCTS ARE PROVIDED
              &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT
              PERMITTED BY APPLICABLE LAW, COMPANY EXPRESSLY DISCLAIMS ALL
              WARRANTIES, INCLUDING WITHOUT LIMITATION:
            </p>
            <NumberedList>
              <li>
                <strong>9.1.1</strong> ANY IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET
                ENJOYMENT, AND NON-INFRINGEMENT;
              </li>
              <li>
                <strong>9.1.2</strong> ANY WARRANTIES ARISING FROM COURSE OF
                DEALING, USAGE, OR TRADE PRACTICE;
              </li>
              <li>
                <strong>9.1.3</strong> ANY WARRANTIES REGARDING THE ACCURACY,
                RELIABILITY, COMPLETENESS, CURRENCY, OR QUALITY OF ANY OUTPUT
                OR VENDOR PRODUCTS;
              </li>
              <li>
                <strong>9.1.4</strong> ANY WARRANTIES THAT THE SERVICES WILL BE
                UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER
                HARMFUL COMPONENTS; AND
              </li>
              <li>
                <strong>9.1.5</strong> ANY WARRANTIES REGARDING THE COMPLIANCE
                OF VENDOR PRODUCTS OR OUTPUTS WITH APPLICABLE LAWS IN ANY
                JURISDICTION.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection id="9.2" title="No SLA">
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              CLIENT ACKNOWLEDGES THAT THE SERVICES ARE PROVIDED ON A
              BEST-EFFORT BASIS ONLY. COMPANY MAKES NO COMMITMENTS REGARDING
              UPTIME, AVAILABILITY, RESPONSE TIMES, LATENCY, OR SERVICE
              CONTINUITY. INTERRUPTIONS, DELAYS, OR OUTAGES, INCLUDING THOSE
              CAUSED BY UPSTREAM PROVIDER ACTIONS OR FAILURES, SHALL NOT
              CONSTITUTE A BREACH OF THIS AGREEMENT. ANY SERVICE LEVEL
              COMMITMENTS REQUIRE A SEPARATELY EXECUTED ORDER FORM EXPRESSLY
              STATING SUCH COMMITMENTS.
            </p>
          </Subsection>
          <Subsection
            id="9.3"
            title="Third-Party Products and Upstream Providers"
          >
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES REGARDING ANY
              VENDOR PRODUCTS, AI MODELS, OR APIS ACCESSIBLE THROUGH THE
              SERVICES. ALL SUCH PRODUCTS ARE PROVIDED SOLELY BY THEIR
              RESPECTIVE UPSTREAM PROVIDERS. COMPANY HAS NO CONTROL OVER THE
              PERFORMANCE, AVAILABILITY, SECURITY, OR POLICY DECISIONS OF ANY
              UPSTREAM PROVIDER. UPSTREAM PROVIDERS MAY MODIFY, RESTRICT, OR
              DISCONTINUE THEIR MODELS OR APIS AT ANY TIME. SUCH ACTIONS BY
              UPSTREAM PROVIDERS DO NOT CONSTITUTE A BREACH OF THIS AGREEMENT
              BY COMPANY.
            </p>
          </Subsection>
          <Subsection id="9.4" title="Output Accuracy">
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              COMPANY DOES NOT WARRANT THE ACCURACY, COMPLETENESS, RELIABILITY,
              TIMELINESS, OR SUITABILITY OF ANY OUTPUT FOR ANY PURPOSE.
              AI-GENERATED OUTPUTS ARE INHERENTLY PROBABILISTIC AND MAY CONTAIN
              ERRORS, HALLUCINATIONS, BIASES, OR INACCURACIES. CLIENT ASSUMES
              ALL RISK AND RESPONSIBILITY FOR ANY RELIANCE ON OR USE OF ANY
              OUTPUT. COMPANY TAKES NO RESPONSIBILITY FOR ANY ACTIONS TAKEN,
              DECISIONS MADE, OR CONSEQUENCES ARISING FROM CLIENT&rsquo;S USE
              OF OR RELIANCE ON ANY OUTPUT.
            </p>
          </Subsection>
          <Subsection
            id="9.5"
            title="No Legal, Medical, or Professional Advice"
          >
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              NO OUTPUT OR OTHER CONTENT PROVIDED THROUGH THE SERVICES
              CONSTITUTES LEGAL, MEDICAL, FINANCIAL, REGULATORY, OR OTHER
              PROFESSIONAL ADVICE. CLIENT SHALL NOT SUBSTITUTE AI-GENERATED
              OUTPUT FOR THE ADVICE OF QUALIFIED PROFESSIONALS IN ANY REGULATED
              FIELD.
            </p>
          </Subsection>
          <Subsection id="9.6" title="Jurisdictional Limitations">
            <p>
              Some jurisdictions do not permit the disclaimer of certain
              warranties. To the extent any such limitation applies, the
              disclaimers in this Section 9 shall apply to the maximum extent
              permitted by applicable law.
            </p>
          </Subsection>
        </Section>

        <Section number="10" title="Limitation of Liability">
          <Subsection id="10.1" title="Exclusion of Damages">
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL COMPANY OR ITS AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES,
              AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING
              WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, REVENUE, GOODWILL,
              DATA, BUSINESS OPPORTUNITIES, OR OTHER INTANGIBLE LOSSES, ARISING
              OUT OF OR RELATING TO THIS AGREEMENT OR THE SERVICES, REGARDLESS
              OF THE THEORY OF LIABILITY AND EVEN IF COMPANY HAS BEEN ADVISED OF
              THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </Subsection>
          <Subsection id="10.2" title="Liability Cap">
            <p>
              Company&rsquo;s total aggregate liability arising out of or
              relating to this Agreement or the Services shall not exceed the
              total fees actually paid by Client to Company during the three
              (3) month period immediately preceding the event giving rise to
              the claim.
            </p>
            <p>
              Notwithstanding the foregoing, the liability cap in this Section
              10.2 shall not apply to: (a) Client&rsquo;s indemnification
              obligations under Sections 3.3 and 11; (b) either party&rsquo;s
              breach of its confidentiality obligations under Section 13; (c)
              Company&rsquo;s gross negligence or willful misconduct; or (d)
              fraud.
            </p>
          </Subsection>
          <Subsection id="10.3" title="Third-Party Liability">
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              COMPANY SHALL HAVE NO LIABILITY FOR ANY ACTS, OMISSIONS, ERRORS,
              FAILURES, POLICY CHANGES, OR DECISIONS OF ANY UPSTREAM PROVIDER,
              AI MODEL PROVIDER, API PROVIDER, OR OTHER VENDOR. ANY CLAIMS
              RELATED TO VENDOR PRODUCTS, INCLUDING CLAIMS ARISING FROM AN
              UPSTREAM PROVIDER&rsquo;S RESTRICTION OR TERMINATION OF ACCESS TO
              ITS MODELS OR APIS, SHALL BE DIRECTED SOLELY AGAINST THE
              APPLICABLE UPSTREAM PROVIDER.
            </p>
          </Subsection>
          <Subsection id="10.4" title="Essential Basis">
            <p>
              Client acknowledges that the limitations of liability in this
              Section 10 reflect a reasonable allocation of risk between the
              parties, are an essential element of the basis of the bargain
              between the parties, and that Company would not provide the
              Services on the terms set forth in this Agreement without such
              limitations.
            </p>
          </Subsection>
        </Section>

        <Section number="11" title="Indemnification">
          <Subsection id="11.1" title="Client Indemnification">
            <p>
              Client shall indemnify, defend, and hold harmless Company and its
              affiliates, directors, officers, employees, agents, and licensors
              (collectively, &ldquo;Company Indemnitees&rdquo;) from and against
              any and all claims, damages, losses, liabilities, costs, and
              expenses (including reasonable attorneys&rsquo; fees) arising out
              of or relating to:
            </p>
            <NumberedList>
              <li>
                <strong>11.1.1</strong> Client&rsquo;s use of the Services or
                any User Content;
              </li>
              <li>
                <strong>11.1.2</strong> Client&rsquo;s breach of this Agreement
                or any representation, warranty, or obligation hereunder;
              </li>
              <li>
                <strong>11.1.3</strong> Client&rsquo;s violation of any
                applicable law, regulation, or third-party right;
              </li>
              <li>
                <strong>11.1.4</strong> any claim that Client&rsquo;s Input or
                User Content infringes or misappropriates any third-party
                intellectual property or other right;
              </li>
              <li>
                <strong>11.1.5</strong> any dispute between Client and any
                third party, including any end-user of Client&rsquo;s products
                or services;
              </li>
              <li>
                <strong>11.1.6</strong> Client&rsquo;s failure to comply with
                applicable Upstream Provider Terms; or
              </li>
              <li>
                <strong>11.1.7</strong> any action taken by an Upstream
                Provider against Company arising from or related to
                Client&rsquo;s use of the Services.
              </li>
            </NumberedList>
          </Subsection>
          <Subsection id="11.2" title="Company Indemnification">
            <p>
              Company shall indemnify, defend, and hold harmless Client and its
              affiliates, directors, officers, employees, and agents from and
              against any third-party claims alleging that the Platform itself
              (excluding Vendor Products, AI Models, APIs, and any Outputs
              generated by third-party AI Models) infringes or misappropriates
              any copyright, patent, trademark, or trade secret of a third
              party. Company&rsquo;s obligations under this Section 11.2 do not
              apply to any claim arising from: (a) Client&rsquo;s modification
              of the Platform or combination of the Platform with other
              products; (b) use of the Platform in violation of this Agreement;
              (c) any Vendor Product or Output; or (d) compliance with
              Client&rsquo;s instructions or specifications.
            </p>
          </Subsection>
          <Subsection id="11.3" title="Procedure">
            <p>
              The indemnified party shall: (a) promptly notify the indemnifying
              party in writing of any claim subject to indemnification (provided
              that failure to provide prompt notice shall not relieve the
              indemnifying party of its obligations except to the extent it is
              materially prejudiced by such failure); (b) grant the indemnifying
              party sole control of the defense and settlement of the claim
              (provided that the indemnifying party shall not settle any claim
              in a manner that imposes obligations on the indemnified party
              without the indemnified party&rsquo;s prior written consent); and
              (c) provide reasonable cooperation in the defense thereof at the
              indemnifying party&rsquo;s expense.
            </p>
          </Subsection>
        </Section>

        <Section number="12" title="Intellectual Property">
          <Subsection id="12.1" title="Company Property">
            <p>
              The Services, Platform, and all related technology, software,
              documentation, and materials (excluding User Content and Vendor
              Products) are the exclusive property of Company or its licensors.
              Client receives no ownership rights in the foregoing and is
              granted only the limited, non-exclusive, non-transferable license
              to access and use the Services as set forth in this Agreement
              during the term hereof.
            </p>
          </Subsection>
          <Subsection id="12.2" title="Vendor Products">
            <p>
              Company does not own, control, or claim any intellectual property
              rights in any AI Models, APIs, or other Vendor Products
              accessible through the Services. All rights in Vendor Products
              remain with their respective Upstream Providers.
            </p>
          </Subsection>
          <Subsection id="12.3" title="Feedback">
            <p>
              If Client provides any suggestions, ideas, or feedback regarding
              the Services (&ldquo;Feedback&rdquo;), Client hereby grants
              Company a perpetual, irrevocable, worldwide, royalty-free,
              fully-paid license to use, reproduce, modify, and incorporate such
              Feedback into the Services without any obligation to Client.
              Feedback does not constitute Confidential Information of Client.
            </p>
          </Subsection>
        </Section>

        <Section number="13" title="Confidentiality">
          <Subsection id="13.1" title="Definition">
            <p>
              &ldquo;Confidential Information&rdquo; means any non-public
              information disclosed by either party to the other in connection
              with this Agreement that is designated as confidential or that,
              given the nature of the information or circumstances of
              disclosure, reasonably should be understood to be confidential.
              Confidential Information includes without limitation business
              plans, technical data, pricing information, and the terms of this
              Agreement.
            </p>
          </Subsection>
          <Subsection id="13.2" title="Obligations">
            <p>
              Each party shall: (a) maintain the confidentiality of the other
              party&rsquo;s Confidential Information using at least the same
              degree of care it uses to protect its own confidential
              information of like kind, but in no event less than reasonable
              care; (b) not disclose such Confidential Information to any third
              party without prior written consent, except to employees,
              contractors, and professional advisors who need to know for
              purposes of this Agreement and are bound by confidentiality
              obligations at least as protective as those in this Agreement;
              and (c) use such Confidential Information only for purposes of
              this Agreement.
            </p>
          </Subsection>
          <Subsection id="13.3" title="Exceptions">
            <p>
              Confidential Information does not include information that: (a)
              is or becomes publicly available through no fault of the
              receiving party; (b) was rightfully in the receiving
              party&rsquo;s possession prior to disclosure without restriction;
              (c) is rightfully obtained from a third party without
              restriction; or (d) is independently developed without use of
              the disclosing party&rsquo;s Confidential Information.
            </p>
          </Subsection>
          <Subsection id="13.4" title="Compelled Disclosure">
            <p>
              If the receiving party is legally compelled to disclose
              Confidential Information, it shall, to the extent legally
              permitted, provide the disclosing party with prompt written
              notice, cooperate with the disclosing party&rsquo;s efforts to
              seek a protective order or other limitation on disclosure, and
              disclose only the minimum Confidential Information required.
            </p>
          </Subsection>
        </Section>

        <Section number="14" title="General Provisions">
          <Subsection id="13.1" title="Governing Law">
            <p>
              This Agreement shall be governed by and construed in accordance
              with the laws of the State of Delaware, without regard to its
              conflict of laws principles.
            </p>
          </Subsection>
          <Subsection
            id="13.2"
            title="Dispute Resolution; Mandatory Arbitration; Class Action Waiver"
          >
            <p>
              <strong>14.2.1 Pre-Arbitration Notice.</strong> Before initiating
              any arbitration, the party seeking relief
              (&ldquo;Claimant&rdquo;) shall provide the other party written
              notice describing in reasonable detail the nature of the dispute
              and the relief sought (&ldquo;Dispute Notice&rdquo;). The parties
              shall attempt in good faith to resolve the dispute within thirty
              (30) days after delivery of the Dispute Notice
              (&ldquo;Resolution Period&rdquo;). Arbitration may not be
              commenced until expiration of the Resolution Period.
            </p>
            <p>
              <strong>14.2.2 Arbitration.</strong> Any dispute, controversy, or
              claim arising out of or relating to this Agreement that is not
              resolved during the Resolution Period shall be resolved by
              binding arbitration administered by the American Arbitration
              Association (&ldquo;AAA&rdquo;) under the AAA Commercial
              Arbitration Rules then in effect. The seat of arbitration shall
              be Wilmington, Delaware. The arbitration shall be conducted by
              one arbitrator mutually agreed upon by the parties or, if the
              parties cannot agree, appointed by the AAA. The arbitrator&rsquo;s
              decision shall be final and binding, and judgment on the award
              may be entered in any court of competent jurisdiction. Nothing in
              this Section 14.2 shall prevent either party from seeking interim
              injunctive relief from a court of competent jurisdiction pending
              the outcome of arbitration.
            </p>
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>
              14.2.3 CLASS ACTION WAIVER. EACH PARTY AGREES THAT ANY DISPUTE
              RESOLUTION PROCEEDING UNDER THIS AGREEMENT SHALL BE CONDUCTED
              ONLY ON AN INDIVIDUAL BASIS AND NOT AS PART OF ANY CLASS,
              COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE ACTION OR
              ARBITRATION. NEITHER PARTY SHALL HAVE THE RIGHT TO PARTICIPATE AS
              A CLASS REPRESENTATIVE OR CLASS MEMBER IN ANY SUCH PROCEEDING.
              THE ARBITRATOR SHALL HAVE NO AUTHORITY TO CONSOLIDATE THE CLAIMS
              OF MORE THAN ONE INDIVIDUAL OR ENTITY OR TO PRESIDE OVER ANY
              CLASS OR REPRESENTATIVE PROCEEDING. IF THIS CLASS ACTION WAIVER
              IS FOUND UNENFORCEABLE FOR ANY REASON, THEN THE ENTIRETY OF
              SECTION 14.2.2 SHALL BE DEEMED VOID AND THE PARTIES AGREE TO
              RESOLVE DISPUTES IN THE COURTS IDENTIFIED IN SECTION 14.1.
            </p>
            <p>
              <strong>14.2.4 Exceptions.</strong> Notwithstanding the
              foregoing: (a) either party may bring an individual action in
              small claims court for disputes within the jurisdictional limits
              of such court; (b) either party may seek injunctive or other
              equitable relief from any court of competent jurisdiction to
              protect intellectual property rights or Confidential Information;
              and (c) Company may bring collection actions for unpaid fees in
              any court of competent jurisdiction.
            </p>
            <p>
              <strong>14.2.5 Modification.</strong> If Company modifies this
              Section 14.2 in a manner materially adverse to Client, Client may
              reject the modification by providing written notice to Company
              within thirty (30) days of the change, in which case this Section
              14.2 as in effect immediately before the modification shall apply
              to pending disputes.
            </p>
          </Subsection>
          <Subsection id="14.3" title="Assignment">
            <p>
              Client may not assign or transfer this Agreement or any rights
              hereunder without Company&rsquo;s prior written consent. Company
              may freely assign this Agreement to any affiliate or to any
              successor in connection with a merger, acquisition, or sale of
              all or substantially all of Company&rsquo;s assets. Any attempted
              assignment in violation of this Section shall be null and void.
              This Agreement shall be binding upon and inure to the benefit of
              the parties and their respective permitted successors and
              assigns.
            </p>
          </Subsection>
          <Subsection id="14.4" title="Entire Agreement">
            <p>
              This Agreement, together with any Order Forms, and the Privacy
              Policy, the DPA, the AUP, and any other policies expressly
              incorporated by reference, constitutes the entire agreement
              between the parties regarding the subject matter hereof and
              supersedes all prior and contemporaneous agreements,
              understandings, and communications. In the event of any conflict,
              the order of precedence shall be: (1) the applicable Order Form
              (for deal-specific commercial terms only); (2) this Agreement;
              (3) the DPA; (4) the AUP; and (5) the Privacy Policy.
            </p>
          </Subsection>
          <Subsection id="14.5" title="Amendment">
            <p>
              For any changes to this Agreement that materially modify
              Client&rsquo;s rights or obligations (including changes to the
              arbitration clause, warranty disclaimers, or liability
              provisions), Company shall provide at least thirty (30)
              days&rsquo; advance written notice by email or in-platform
              notification. Client&rsquo;s continued use of the Services after
              the effective date of any material amendment constitutes
              acceptance of the amendment. All other changes (including changes
              to the AUP or pricing schedules, subject to Section 7.7) will be
              effective upon posting to the Platform. Company will maintain a
              changelog of Agreement amendments at
              console.inference.ai/changelog.
            </p>
          </Subsection>
          <Subsection id="14.6" title="Severability">
            <p>
              If any provision of this Agreement is held to be invalid or
              unenforceable, such provision shall be modified to the minimum
              extent necessary to make it valid and enforceable, and the
              remaining provisions shall continue in full force and effect.
            </p>
          </Subsection>
          <Subsection id="14.7" title="Waiver">
            <p>
              No failure or delay by either party in exercising any right under
              this Agreement shall constitute a waiver of that right. No waiver
              of any breach shall be deemed a waiver of any subsequent breach.
            </p>
          </Subsection>
          <Subsection id="14.8" title="Force Majeure">
            <p>
              Neither party shall be liable for any failure or delay in
              performance due to circumstances beyond its reasonable control,
              including without limitation acts of God, natural disasters, war,
              terrorism, government actions, cyberattacks, or failures of
              third-party infrastructure providers, provided that the affected
              party promptly notifies the other party and uses commercially
              reasonable efforts to mitigate the impact. This Section shall not
              excuse Client&rsquo;s payment obligations for Services rendered
              prior to the force majeure event.
            </p>
          </Subsection>
          <Subsection id="14.9" title="Export Compliance">
            <p>
              Client shall comply with all applicable export control laws and
              regulations, including the Export Administration Regulations
              (EAR) and regulations administered by the Office of Foreign
              Assets Control (&ldquo;OFAC&rdquo;). Client represents and
              warrants that: (a) Client is not located in, organized under the
              laws of, or ordinarily resident in any jurisdiction subject to
              comprehensive U.S. sanctions; (b) Client is not identified on any
              U.S. government restricted party list, including the OFAC
              Specially Designated Nationals and Blocked Persons List; and (c)
              Client shall not provide access to the Services to any person or
              entity in violation of applicable export or sanctions laws.
              Company may immediately terminate this Agreement without
              liability upon becoming aware of any violation of this Section or
              upon any sanctions designation affecting Client.
            </p>
          </Subsection>
          <Subsection id="14.10" title="Electronic Communications">
            <p>
              Client consents to receive communications from Company
              electronically, including via email, the Platform, or posting on
              Company&rsquo;s website. Such electronic communications satisfy
              any legal requirement that communications be in writing.
            </p>
          </Subsection>
          <Subsection id="14.11" title="Notices">
            <p>
              All legal notices under this Agreement shall be in writing and
              deemed given when: (a) delivered personally; (b) sent by
              confirmed email with read receipt to the address designated by
              the receiving party; or (c) three (3) days after being sent by
              certified mail, return receipt requested, to the addresses
              specified in the applicable Order Form or, for Company, to:
              Distribyte Inc., 1007 N Orange St., 4th Floor, Suite #2468,
              Wilmington, Delaware 19801; legal@inference.ai.
            </p>
          </Subsection>
          <Subsection id="14.12" title="Independent Contractors">
            <p>
              The parties are independent contractors. Nothing in this
              Agreement creates any partnership, joint venture, agency,
              franchise, employment, or fiduciary relationship between the
              parties.
            </p>
          </Subsection>
          <Subsection id="14.13" title="Publicity">
            <p>
              Neither party shall issue any press release or public
              announcement regarding this Agreement without the other
              party&rsquo;s prior written consent, except that Company may
              reference Client&rsquo;s name as a customer in Company&rsquo;s
              marketing materials unless Client provides written objection.
            </p>
          </Subsection>
        </Section>

        <div
          className="mt-16 pt-10 font-semibold"
          style={{
            borderTop: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          BY ACCESSING OR USING THE SERVICES, CLIENT ACKNOWLEDGES THAT CLIENT
          HAS READ, UNDERSTOOD, AND AGREES TO BE BOUND BY THIS AGREEMENT,
          INCLUDING THE MANDATORY ARBITRATION PROVISION AND CLASS ACTION WAIVER
          IN SECTION 14.2.
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2
        className="text-2xl md:text-3xl font-bold mb-6 tracking-tight"
        style={{ color: "var(--color-text)" }}
      >
        {number}. {title}
      </h2>
      <div
        className="space-y-5 text-base leading-relaxed"
        style={{ color: "var(--color-text-dim)" }}
      >
        {children}
      </div>
    </section>
  );
}

function Subsection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3
        className="text-lg font-semibold mb-3"
        style={{ color: "var(--color-text)" }}
      >
        {id} {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Clause({
  id,
  term,
  altTerm,
  children,
}: {
  id: string;
  term: string;
  altTerm?: string;
  children: React.ReactNode;
}) {
  return (
    <p className="mt-3">
      <strong style={{ color: "var(--color-text)" }}>{id}</strong>{" "}
      &ldquo;{term}&rdquo;
      {altTerm ? (
        <>
          {" "}or &ldquo;{altTerm}&rdquo;
        </>
      ) : null}{" "}
      {children}
    </p>
  );
}

function NumberedList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="space-y-3 pl-4 border-l" style={{ borderColor: "var(--color-border)" }}>
      {children}
    </ul>
  );
}
