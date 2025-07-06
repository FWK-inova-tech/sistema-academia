export const Loading = ({ loadingMessage } : {loadingMessage: string}) => {
  return(
    <div>
      <p>Carregando</p>
      <p>{loadingMessage}</p>
    </div>
  )
}