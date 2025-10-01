import { Box, TextField, InputAdornment, MenuItem, Button, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export type SortKey = "recommended" | "arrival_asc" | "rating_desc";
export default function SearchSortBar({ query, onQuery, sortBy, onSort, onReset }:{
  query:string; onQuery:(v:string)=>void; sortBy:SortKey; onSort:(v:SortKey)=>void; onReset:()=>void;
}){
  return (
    <Box sx={{ p:1.5 }}>
      <Stack direction={{ xs:"column", sm:"row" }} spacing={1.5} alignItems={{ xs:"stretch", sm:"center" }}>
        <TextField
          fullWidth size="small" placeholder="Search restaurants or cuisines…"
          value={query} onChange={(e)=>onQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment> }}
        />
        <Box sx={{ display:"flex", gap:1 }}>
          <TextField select size="small" label="Sort" value={sortBy} onChange={(e)=>onSort(e.target.value as SortKey)} sx={{ minWidth:220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><TuneIcon fontSize="small"/></InputAdornment> }}>
            <MenuItem value="recommended">Recommended</MenuItem>
            <MenuItem value="arrival_asc">Earliest arrival</MenuItem>
            <MenuItem value="rating_desc">Rating (High → Low)</MenuItem>
          </TextField>
          <Button onClick={onReset} variant="outlined" startIcon={<RestartAltIcon/>}>Reset</Button>
        </Box>
      </Stack>
    </Box>
  );
}
