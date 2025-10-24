import { Typography, Stack, List, ListItem } from "@mui/material";

export default function TermsOfUse() {
  return (
    <>
      <Stack spacing={2}>
        <Typography variant="body1">
          Welcome to Typing Help (“we,” “our,” “us”). These Terms of Use (“Terms”)
          govern your access to and use of our typing practice application (“App”).
          By creating an account or using the App, you agree to be bound by these
          Terms. If you do not agree, please do not use the App.
        </Typography>

        <Typography variant="h6">
          1. Eligibility
        </Typography>
        <Typography variant="body1">
          The App is intended for teachers, students, and individual users seeking
          to improve typing skills. If you are under 18, you may use the App only
          with the consent and supervision of a parent, guardian, or teacher.
          Teachers are responsible for ensuring their students’ use complies with
          applicable school or district policies.
        </Typography>

        <Typography variant="h6">
          2. Accounts
        </Typography>
        <Typography variant="body1">
          You must provide accurate information when creating an account. Teachers
          may create accounts for their students or invite students to join
          classes within the App. You are responsible for keeping your login
          credentials secure and for all activity under your account.
        </Typography>

        <Typography variant="h6">
          3. Acceptable Use
        </Typography>
        <Typography variant="body1">
          When using the App, you agree not to:
        </Typography>
        <List dense>
          <ListItem>
            <Typography variant="body1">Use the App for unlawful purposes;</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Share inappropriate, harmful, or offensive content;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Attempt to disrupt, attack, hack, or reverse-engineer the App;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Collect or misuse data from other users;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Impersonate others or provide false information.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h6">
          4. Student Privacy
        </Typography>
        <Typography variant="body1">
          We prioritize protecting student privacy. Teachers are responsible for
          obtaining any required parental or guardian consent before allowing
          students to use the App. We will not sell or share personal student
          information with third parties for marketing purposes.
        </Typography>
        <Typography variant="body1">
          Note: Schools or districts may have additional privacy or
          data-protection requirements (for example, COPPA, FERPA, or local laws).
          Teachers and administrators should ensure that they comply with all
          applicable legal obligations when using the App in a classroom setting.
        </Typography>

        <Typography variant="h6">
          5. Content and Intellectual Property
        </Typography>
        <Typography variant="body1">
          All instructional materials, exercises, and software provided in the App
          are owned by us or our licensors. You may use the App’s content for
          personal learning or classroom teaching, but you may not copy, resell,
          redistribute, or sublicense it without our prior written permission.
        </Typography>

        <Typography variant="h6">
          6. Service Availability
        </Typography>
        <Typography variant="body1">
          We strive to keep the App available but do not guarantee uninterrupted
          access. We may suspend, modify, or discontinue the App at any time, with
          or without notice. We are not responsible for losses or damages caused
          by service interruptions.
        </Typography>

        <Typography variant="h6">
          7. Disclaimer of Warranties
        </Typography>
        <Typography variant="body1">
          The App is provided{" "}
          <Typography component="span" fontWeight="bold">
            “as is”
          </Typography>{" "}
          and{" "}
          <Typography component="span" fontWeight="bold">
            “as available”
          </Typography>
          , without warranties of any kind, either express or implied. We do not
          warrant that the App will be error-free, secure, or meet your specific
          educational needs.
        </Typography>

        <Typography variant="h6">
          8. Limitation of Liability
        </Typography>
        <Typography variant="body1">
          To the fullest extent permitted by law, we will not be liable for
          indirect, incidental, special, consequential, or punitive damages
          arising from your use of (or inability to use) the App. Our total
          liability in any claim related to the App will not exceed the amount
          paid by you to use the App (if any), or $100 if you paid nothing.
        </Typography>

        <Typography variant="h6">
          9. Termination
        </Typography>
        <Typography variant="body1">
          We may suspend or terminate your account if you violate these Terms. You
          may stop using the App at any time. Upon termination, any rights granted
          to you under these Terms will immediately cease.
        </Typography>

        <Typography variant="h6">
          10. Changes to These Terms
        </Typography>
        <Typography variant="body1">
          We may update these Terms from time to time. When we make material
          changes, we will notify users via the App or by email. Continued use of
          the App after changes indicates your acceptance of the updated Terms.
        </Typography>

        <Typography variant="h6">
          11. Governing Law
        </Typography>
        <Typography variant="body1">
          These Terms are governed by the laws of{" "}
          <Typography component="span" fontWeight="bold">
            Fairfax, VA
          </Typography>
          . Any disputes arising under these Terms will be subject to the
          exclusive jurisdiction of the courts located in{" "}
          <Typography component="span" fontWeight="bold">
            Fairfax, VA
          </Typography>
          , unless otherwise required by law.
        </Typography>
      </Stack>
    </>
  );
}
