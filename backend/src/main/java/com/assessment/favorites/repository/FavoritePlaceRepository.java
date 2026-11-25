package com.assessment.favorites.repository;

import com.assessment.favorites.domain.FavoritePlace;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoritePlaceRepository extends JpaRepository<FavoritePlace, Long> {
  Optional<FavoritePlace> findByPlaceId(String placeId);

  void deleteByPlaceId(String placeId);

  boolean existsByPlaceId(String placeId);
}
