import { Card } from 'primereact/card'
import { Button } from 'primereact/button'

export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <Card
        title="Social Game Network"
        subTitle="Bem-vindo"
        style={{ marginBottom: '1rem' }}
      >
        <p style={{ margin: '0 0 1.5rem 0', lineHeight: 1.6 }}>
          Conecte-se com jogadores, descubra novos games e compartilhe suas partidas.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button label="Entrar" icon="pi pi-sign-in" />
          <Button label="Cadastrar" icon="pi pi-user-plus" className="p-button-outlined" />
        </div>
      </Card>
    </div>
  )
}
