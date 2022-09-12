import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

interface IPagination {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}
const Pagination = ({ page, setPage }: IPagination) => {
  const numPages = 20;
  return (
    <PaginationBox>
      <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
        &lt;
      </Button>
      {Array(numPages)
        .fill(0)
        .map((_, i) => (
          <Button
            current={i + 1 === page}
            key={i + 1}
            onClick={() => {
              setPage(i + 1);
            }}
          >
            {i + 1}
          </Button>
        ))}
      <Button onClick={() => setPage(page + 1)} disabled={page === numPages}>
        &gt;
      </Button>
    </PaginationBox>
  );
};

export default Pagination;

const Button = styled.button<{ current?: boolean }>`
  border: none;
  border-radius: 8px;
  padding: 8px;
  margin: 0;
  background: ${(props) => (props.current ? `orange` : `black`)};
  color: white;
  font-size: 1rem;

  :hover {
    background: tomato;
    cursor: pointer;
    transform: translateY(-2px);
  }

  &:disabled {
    background: grey;
    transform: revert;
    cursor: revert;
  }
`;
const PaginationBox = styled.div`
  margin: 80px 0 80px 0;
  text-align: center;
`;
