import { InputText } from "primereact/inputtext";
import {
  FormMessage,
  FormField,
  FormSubmitButton,
} from "@/presentation/components/Form";
import { useCreateAccountForm } from "../hooks";

export function CreateAccountForm() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    error,
    success,
    loading,
    handleSubmit,
  } = useCreateAccountForm();

  return (
    <form onSubmit={handleSubmit} className="create-account-form">
      {error && (
        <FormMessage
          severity="error"
          text={error}
          className="create-account-message"
        />
      )}
      {success && (
        <FormMessage
          severity="success"
          text={success}
          className="create-account-message"
        />
      )}
      <FormField
        label="Username"
        id="username"
        fieldClassName="create-account-field"
        labelClassName="create-account-label"
      >
        <InputText
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="create-account-input w-full"
          autoComplete="username"
          disabled={loading}
        />
      </FormField>
      <FormField
        label="Email"
        id="email"
        fieldClassName="create-account-field"
        labelClassName="create-account-label"
      >
        <InputText
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="create-account-input w-full"
          type="email"
          autoComplete="email"
          disabled={loading}
        />
      </FormField>
      <FormField
        label="Senha"
        id="password"
        fieldClassName="create-account-field"
        labelClassName="create-account-label"
      >
        <InputText
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="create-account-input w-full"
          type="password"
          autoComplete="password"
          disabled={loading}
        />
      </FormField>
      <FormSubmitButton
        label="Criar conta"
        loading={loading}
        className="create-account-btn"
      />
    </form>
  );
}
