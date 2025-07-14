import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper';
import { Box, Button, LinearProgress, TablePagination, TableSortLabel, Typography } from '@mui/material';
import { Delete, Download } from '@mui/icons-material';
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

function P2sFileGrid({ 
    rows, columns, downloadFile, handleDelete, downloadProgress, 
    downloadDisabled, canDelete, roomActions, isAdmin
}) {
  const columnsFiltered = isAdmin ? columns : roomActions === 3 ? columns.filter((x)=> x.field !== "download" && x.field !== "delete"):columns.filter((x)=> x.field !== "delete")
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
                {columnsFiltered.map((column, i) => (
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
                    {row.sender}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" width={"200px"}>
                    {row.size}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography fontSize={"14px"} lineHeight={"19.5px"}>
                      {new Date(row.deleteOn).toLocaleDateString()}
                    </Typography>
                  </StyledTableCell>
                  {isAdmin || roomActions !== 3?<StyledTableCell>
                    {!!downloadProgress[row.file]?null:<Button variant='contained' color='secondary' 
                    disabled={!!downloadProgress[row.file] || downloadDisabled} 
                    onClick={() => downloadFile(row.file, row.id)} startIcon={<Download />}>
                      Download
                    </Button>}
                    {downloadProgress[row.file] &&
                        downloadProgress[row.file] >= 0 && (
                            <Box width={"100%"}>
                                <Typography>
                                    Status: {downloadProgress[row.file]}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={downloadProgress[row.file]}
                                />
                            </Box>
                        )
                    }
                  </StyledTableCell>:null}
                    {canDelete?
                  <StyledTableCell>
                    <Button variant='contained' color='error' onClick={() => handleDelete(row.file, row.id)} startIcon={<Delete />}>
                      Delete
                    </Button>
                  </StyledTableCell>
                    : null
                    }
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
  
  export default P2sFileGrid;