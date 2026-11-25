package com.assessment.favorites.service;

import com.assessment.favorites.domain.FavoritePlace;
import com.assessment.favorites.repository.FavoritePlaceRepository;
import com.assessment.favorites.web.dto.FavoriteRequest;
import com.assessment.favorites.web.dto.FavoriteResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Business logic for favourites. Save is upsert-by-placeId
 * so starring the same place twice updates instead of failing.
 */
@Service
public class FavoritePlaceService {

  private final FavoritePlaceRepository repository;

  public FavoritePlaceService(FavoritePlaceRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  public List<FavoriteResponse> findAll() {
    return repository.findAll().stream().map(FavoriteResponse::from).toList();
  }

  @Transactional
  public FavoriteResponse save(FavoriteRequest request) {
    FavoritePlace entity =
        repository
            .findByPlaceId(request.getPlaceId())
            .orElseGet(FavoritePlace::new);

    entity.setPlaceId(request.getPlaceId());
    entity.setName(request.getName());
    entity.setAddress(request.getAddress());
    entity.setLat(request.getLat());
    entity.setLng(request.getLng());

    return FavoriteResponse.from(repository.save(entity));
  }

  @Transactional
  public void deleteByPlaceId(String placeId) {
    if (!repository.existsByPlaceId(placeId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Favourite not found");
    }
    repository.deleteByPlaceId(placeId);
  }
}
