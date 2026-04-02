import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface GuiaVendedoresEmailProps {
  name: string;
}

export const GuiaVendedoresEmail = ({
  name,
}: GuiaVendedoresEmailProps) => {
  // En Next.js el dominio de producción suele estar en VERCEL_URL o se define en producción
  const baseUrl = "https://www.freirepropiedades.com";

  return (
    <Html>
      <Head />
      <Preview>Aquí tienes tu Guía del Vendedor</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo-blanco-oficial.png`}
              width="80"
              alt="Freire Propiedades"
              style={logo}
            />
          </Section>
          
          <Section style={content}>
            <Heading style={heading}>
              Vender tu casa, paso a paso
            </Heading>
            <Text style={paragraph}>
              Hola <strong>{name}</strong>,
            </Text>
            <Text style={paragraph}>
              Gracias por solicitar nuestra Guía del Vendedor, aquí encontrarás toda la información necesaria para vender tu casa con éxito.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={`${baseUrl}/guia-vendedores.pdf`}>
                Descargar Guía en PDF
              </Button>
            </Section>
            <Text style={paragraph}>
              Si después de leer la guía consideras que tu propiedad necesita una evaluación profesional por parte de nuestro equipo, no dudes en responder directamente a este correo o agendar una tasación desde nuestra plataforma.
            </Text>
            <Section style={whatsappContainer}>
              <Button style={whatsappButton} href="https://wa.me/5491151454915?text=Hola,%20vi%20la%20guía%20y%20me%20gustaría%20generar%20una%20tasación%20profesional">
                <Img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" width="20" height="20" alt="WhatsApp" style={waIcon} />
                Contactar por WhatsApp
              </Button>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              FREIRE Negocios Inmobiliarios<br />
              Edificio STUDIOS Work&Live, Pilar<br />
              contacto@freirepropiedades.com
            </Text>
            <Text style={footerLinks}>
              <Link href="https://www.freirepropiedades.com" style={link}>Visitar Sitio Web</Link> •{" "}
              <Link href="https://www.freirepropiedades.com/contacto" style={link}>Contacto Directo</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default GuiaVendedoresEmail;

const main = {
  backgroundColor: "#f7f9fa",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "40px auto",
  width: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  border: "1px solid #eaeaea",
};

const header = {
  backgroundColor: "#0B1D3A", // Primary Navy
  padding: "40px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "40px 40px 20px",
};

const label = {
  color: "#D4AF37", // Secondary Gold
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  marginBottom: "10px",
};

const heading = {
  color: "#0B1D3A",
  fontSize: "28px",
  fontWeight: "bold",
  lineHeight: "1.2",
  margin: "0 0 24px",
};

const paragraph = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  marginBottom: "24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0 40px",
};

const button = {
  backgroundColor: "#0B1D3A",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const whatsappContainer = {
  textAlign: "center" as const,
  margin: "16px 0 32px",
};

const whatsappButton = {
  backgroundColor: "#25D366",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "16px 32px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const waIcon = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: "8px",
};

const footer = {
  backgroundColor: "#f8f9fa",
  padding: "32px 40px",
  borderTop: "1px solid #eaeaea",
};

const footerText = {
  color: "#718096",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const footerLinks = {
  textAlign: "center" as const,
  margin: "0",
};

const link = {
  color: "#0B1D3A",
  fontSize: "12px",
  textDecoration: "underline",
};
