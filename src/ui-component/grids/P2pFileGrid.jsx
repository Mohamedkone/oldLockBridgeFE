import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper';
import { TablePagination, TableSortLabel } from '@mui/material';
import { useState } from 'react';
import { useMemo } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F2F4F6",
    color: "#000",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor:"#fff",
    outline:"10px"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function P2pFileGrid({ 
    rows, columns, 
    // downloadFile, handleDelete, downloadProgress, 
    // downloadDisabled, canDelete 
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('file');
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    const parseSize = (size) => {
      const units = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
      const match = size.match(/(\d+(\.\d+)?)\s*(B|KB|MB|GB)/);
      return match ? parseFloat(match[1]) * units[match[3]] : 0;
    };
  
    const sortedRows = useMemo(() => {
      const comparator = (a, b) => {
        if (orderBy === 'deleteOn') {
          return order === 'asc'
            ? new Date(a[orderBy]) - new Date(b[orderBy])
            : new Date(b[orderBy]) - new Date(a[orderBy]);
        } else if (orderBy === 'size') {
          const sizeA = parseSize(a[orderBy]);
          const sizeB = parseSize(b[orderBy]);
          return order === 'asc' ? sizeA - sizeB : sizeB - sizeA;
        } else {
          if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
          if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
          return 0;
        }
      };
      return rows.slice().sort(comparator);
    }, [rows, order, orderBy]);
  
    return (
      <Paper>
        <TableContainer component={Paper} sx={{borderRadius:"10px"}}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {columns.map((column, i) => (
                  <StyledTableCell key={i}>
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.field}
                        direction={orderBy === column.field ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, column.field)}
                      >
                        {column.headerName}
                      </TableSortLabel>
                    ) : (
                      column.headerName
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{border:"1px solid #D6DAE2"}}>
              {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell component="th" scope="row" width={"200px"}>
                    {row.file}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" width={"200px"}>
                    {row.status}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
  
  export default P2pFileGrid;