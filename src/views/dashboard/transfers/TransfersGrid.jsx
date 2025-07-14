import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableSortLabel, Accordion, AccordionSummary, AccordionDetails, Tooltip, Chip, TablePagination } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState, useMemo } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F2F4F6",
    color: "#000",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: "#fff",
    outline: "10px"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function TransfersGrid({ rows, columns, isVault}) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('email');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const parseSize = (size) => {
    const units = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    const match = size.match(/(\d+(\.\d+)?)\s*(B|KB|MB|GB)/);
    return match ? parseFloat(match[1]) * units[match[3]] : 0;
  };

  const naturalSort = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const sortedRows = useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === 'size') {
        const sizeA = parseSize(a[orderBy]);
        const sizeB = parseSize(b[orderBy]);
        return order === 'asc' ? sizeA - sizeB : sizeB - sizeA;
      } else if (orderBy === 'date') {
        return order === 'asc'
          ? new Date(a[orderBy]) - new Date(b[orderBy])
          : new Date(b[orderBy]) - new Date(a[orderBy]);
      } else {
        return order === 'asc'
          ? naturalSort(a[orderBy], b[orderBy])
          : naturalSort(b[orderBy], a[orderBy]);
      }
    };
    return rows.slice().sort(comparator);
  }, [rows, order, orderBy]);

  return (
    <>
    <TableContainer  sx={{ borderRadius: "10px" }}>
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
        <TableBody sx={{ border: "1px solid #D6DAE2" }}>
          {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell component="th" scope="row">
                {row.email}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" width={"200px"}>
                {row.filename}
              </StyledTableCell>
              <StyledTableCell width={"130px"}>{row.size}</StyledTableCell>
              <StyledTableCell>{row.type}</StyledTableCell>
              <StyledTableCell>{row.date}</StyledTableCell>
              {isVault?null:<StyledTableCell>
                {row.received === null
                  ? <HourglassTopIcon />
                  : row.received
                    ? <CheckCircleIcon color="success" />
                    : <CancelIcon color='error' />}
              </StyledTableCell>}
              {isVault?null:<StyledTableCell>
                {row.receiver}
              </StyledTableCell>}
              {isVault?<StyledTableCell>
                {row.receivers !== null && row.receivers?.length !== 0   ? row.receivers?.length > 1 ?
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      {row?.receivers?.length} users | See more...
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {row?.receivers.map((user, i) => (
                        <Tooltip title={user.email} placement='top-start' key={i} sx={{ background: '#25ba6f' }}>
                          <Chip label={user.name} sx={{ background: user.received === 1 ? '#25ba6f' : "#b72424", fontWeight: "bold", color: "#fff" }} />
                        </Tooltip>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                  :
                  row.receivers.map((user, i) => (
                    <Tooltip title={user.email} placement='top-start' key={i} sx={{ background: '#25ba6f' }}>
                      <Chip label={user.name} sx={{ background: user.received === 1 ? '#25ba6f' : "#b72424", fontWeight: "bold", color: "#fff" }} />
                    </Tooltip>
                  )) : "No user has downloaded this file"}
              </StyledTableCell> : null}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
    rowsPerPageOptions={[ 5, 10, 25, 50, 100]}
    component="div"
    count={rows.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />
  </>
  );
}

export default TransfersGrid;
