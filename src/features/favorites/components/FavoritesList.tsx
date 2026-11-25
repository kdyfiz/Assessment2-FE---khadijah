import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import type { FavoritePlace } from '../../places/types';

interface FavoritesListProps {
  items: FavoritePlace[];
  selectedPlaceId: string | null;
  onSelect: (item: FavoritePlace) => void;
  onRemove: (placeId: string) => void;
}

/**
 * Optional requirement: favourites persisted via Spring Boot + DB.
 * Shown separately from Redux search history so they survive page refresh.
 */
export function FavoritesList({
  items,
  selectedPlaceId,
  onSelect,
  onRemove,
}: FavoritesListProps) {
  if (items.length === 0) {
    return (
      <Box sx={{ py: 1.5 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.08em', mb: 1 }}
        >
          Favourites · 0
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Star a place from your searches to save it in the database.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1} sx={{ minHeight: 0 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.08em' }}
      >
        Favourites · {items.length}
      </Typography>

      <List dense disablePadding sx={{ maxHeight: 220, overflow: 'auto', mx: -0.5 }}>
        {items.map((item) => {
          const selected = item.placeId === selectedPlaceId;
          return (
            <ListItem
              key={item.placeId}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="Remove favourite"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.placeId);
                  }}
                  sx={{ color: 'secondary.main' }}
                >
                  <StarIcon />
                </IconButton>
              }
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                selected={selected}
                onClick={() => onSelect(item)}
                sx={{
                  pr: 7,
                  py: 1,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: selected ? 'rgba(31, 75, 99, 0.22)' : 'transparent',
                }}
              >
                <ListItemText
                  primary={item.name}
                  secondary={item.address}
                  primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}
