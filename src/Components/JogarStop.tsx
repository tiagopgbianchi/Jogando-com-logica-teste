import { useNavigate } from 'react-router-dom';

function jogarStop() {
  const navigate = useNavigate();

  function jogarStop() {

    navigate('/stoppage');
  }

  return (
    <button onClick={jogarStop}>
      Jogar
    </button>
  );
}

export default jogarStop;