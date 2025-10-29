import { Typography, Stack, List, ListItem } from "@mui/material";

export default function PrivacyPolicy() {
  return (
      <Stack spacing={2}>
        <Typography variant="body1">
          This Privacy Policy explains how{" "}
          <Typography component="span" fontWeight="bold">
            Typing Help
          </Typography>{" "}
          (“we”, “our”, or “us”) collects, uses, and protects your personal
          information when you use our typing practice application (the “App”).
        </Typography>

        <Typography variant="h6">
          1. Information We Collect
        </Typography>
        <List dense>
          <ListItem>
            <Typography variant="body1">
              <Typography component="span" fontWeight="bold">
                Account Information:
              </Typography>{" "}
              Name, email address, birth year (if provided), and class enrollment
              data.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              <Typography component="span" fontWeight="bold">
                Usage Data:
              </Typography>{" "}
              Typing activity, lesson progress, and performance statistics.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              <Typography component="span" fontWeight="bold">
                Device Information:
              </Typography>{" "}
              IP address, browser type, and operating system (collected
              automatically).
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              <Typography component="span" fontWeight="bold">
                Teacher-Provided Data:
              </Typography>{" "}
              If you are a student, teachers may provide your name, class, or
              grade level to create or manage your account.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h6">
          2. How We Use Your Information
        </Typography>
        <Typography variant="body1">
          We use the information collected to:
        </Typography>
        <List dense>
          <ListItem>
            <Typography variant="body1">
              Provide typing practice lessons and track progress;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Allow teachers to create and manage student accounts and monitor
              student progress;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Improve the functionality and features of the App;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Communicate important updates or service changes;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Ensure compliance with applicable laws and regulations.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h6">
          3. Children’s Privacy
        </Typography>
        <Typography variant="body1">
          The App may be used by students under 13, but only under the supervision of a teacher or guardian. Teachers are responsible for obtaining necessary parental consent before creating or enabling student accounts. We do not knowingly collect personal information from children without appropriate consent.
        </Typography>

        <Typography variant="h6">
          4. Data Sharing
        </Typography>
        <Typography variant="body1">
          We do not sell or rent your personal information. We may share information only in the following cases:
        </Typography>
        <List dense>
          <ListItem>
            <Typography variant="body1">
              With service providers who support our operations (e.g., hosting,
              analytics);
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              If required by law, regulation, or legal process;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              To protect the security and rights of our users or the App.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h6">
          5. Data Security
        </Typography>
        <Typography variant="body1">
          We implement appropriate technical and organizational measures to
          protect your personal data from unauthorized access, alteration,
          disclosure, or destruction. However, no online service is completely
          secure, and we cannot guarantee absolute security.
        </Typography>

        <Typography variant="h6">
          6. Data Retention
        </Typography>
        <Typography variant="body1">
          We retain personal information for as long as needed to provide the App
          and for legitimate business or legal purposes. Teachers or students may
          request account deletion by contacting us.
        </Typography>

        <Typography variant="h6">
          7. Your Rights
        </Typography>
        <Typography variant="body1">
          You may have rights under applicable data-protection laws, including the
          right to:
        </Typography>
        <List dense>
          <ListItem>
            <Typography variant="body1">
              Access the personal data we hold about you;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Request corrections to inaccurate information;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Request deletion of your account and associated data;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Restrict or object to certain data processing;
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              Request a copy of your personal data.
            </Typography>
          </ListItem>
        </List>

        <Typography variant="h6">
          8. International Users
        </Typography>
        <Typography variant="body1">
          If you access the App from outside [Insert Jurisdiction], please note
          that your information will be processed and stored in [Insert
          Jurisdiction], where data protection laws may differ from your home
          country.
        </Typography>

        <Typography variant="h6">
          9. Changes to This Policy
        </Typography>
        <Typography variant="body1">
          We may update this Privacy Policy from time to time. If we make
          significant changes, we will notify users via the App or by email.
          Continued use of the App after updates indicates your acceptance of the
          revised policy.
        </Typography>
      </Stack>
  );
}
