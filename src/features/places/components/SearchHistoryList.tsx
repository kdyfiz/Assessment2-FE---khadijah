/**
 * Redux search history list (session only).
 * Star buttons appear when the favourites API is online.
 */
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import type { PlaceSearchResult } from '../types';

interface SearchHistoryListProps {
  searches: PlaceSearchResult[];
  selectedId: string | null;
  favoritePlaceIds: Set<string>;
  onSelect: (id: string) => void;
  onClear: () => void;
  onToggleFavorite: (place: PlaceSearchResult) => void;
  favoritesEnabled: boolean;
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function SearchHistoryList({
  searches,
  selectedId,
  favoritePlaceIds,
  onSelect,
  onClear,
  onToggleFavorite,
  favoritesEnabled,
}: SearchHistoryListProps) {
  if (searches.length === 0) {
    return (
      <Box
        className="anim-fade"
        sx={{
          py: 4,
          px: 1,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <PlaceOutlinedIcon sx={{ fontSize: 36, mb: 1, opacity: 0.45 }} />
        <Typography variant="subtitle2" color="text.primary" gutterBottom>
          No searches yet
        </Typography>
        <Typography variant="body2">
          Every place you pick from autocomplete is stored in Redux and listed
          here.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1} sx={{ height: '100%', minHeight: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.08em' }}
        >
          Searches · {searches.length}
        </Typography>
        <Button size="small" onClick={onClear} color="inherit" sx={{ minWidth: 0 }}>
          Clear
        </Button>
      </Stack>

      <List
        dense
        disablePadding
        sx={{
          overflow: 'auto',
          flex: 1,
          minHeight: 0,
          pr: 0.5,
          mx: -0.5,
        }}
      >
        {searches.map((place, index) => {
          const isFav = favoritePlaceIds.has(place.placeId);
          const selected = place.id === selectedId;

          return (
            <ListItem
              key={place.id}
              disablePadding
              className="anim-rise"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              secondaryAction={
                favoritesEnabled ? (
                  <IconButton
                    edge="end"
                    aria-label={isFav ? 'Remove favourite' : 'Save favourite'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(place);
                    }}
                    sx={{ color: isFav ? 'secondary.main' : 'text.secondary' }}
                  >
                    {isFav ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                ) : undefined
              }
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                selected={selected}
                onClick={() => onSelect(place.id)}
                sx={{
                  pr: favoritesEnabled ? 7 : 2,
                  py: 1.1,
                  border: '1px solid',
                  borderColor: selected ? 'rgba(31, 75, 99, 0.22)' : 'transparent',
                }}
              >
                <ListItemText
                  primary={place.name}
                  secondary={
                    <>
                      <Box
                        component="span"
                        sx={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {place.address}
                      </Box>
                      <Box component="span" sx={{ opacity: 0.8 }}>
                        {formatWhen(place.searchedAt)}
                      </Box>
                    </>
                  }
                  primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}
