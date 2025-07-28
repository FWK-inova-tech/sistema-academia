export const Loading = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    <div className="mt-[15em]">
      <div id="loading"></div>
      <p>Carregando: {loadingMessage}</p>
    </div>
  )
}
