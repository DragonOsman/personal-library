import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text
} from "@react-email/components";
import logo from "@/public/images/logo.png";

const baseUrl = process.env.BASE_URL;

export interface VerificationTemplateProps {
  username: string;
  emailVerificationToken: string;
}

const main = {
  backgroundColor: "#020817",
  color: "#ffffff",
  fontFamily: "'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif"
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px"
};

export const verificationTemplate = ({
  username,
  emailVerificationToken
}: VerificationTemplateProps) => (
  <Html>
    <Head />
    <Preview>Account verification email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={logo.src}
          alt="dragon logo"
        />
        <Text>Hi, {username}!</Text>
        <Text>Welcome to DragonOsman's Personal Library</Text>
        <Text>Please click or tap the link below to verify your email address:</Text>
        <Section>
          <Button
            href={`${baseUrl}/auth/verify-email?token=${emailVerificationToken}`}
          >
            Click here to verify
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);