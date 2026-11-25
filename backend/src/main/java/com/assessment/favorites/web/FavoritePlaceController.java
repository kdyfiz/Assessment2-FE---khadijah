package com.assessment.favorites.web;

import com.assessment.favorites.service.FavoritePlaceService;
import com.assessment.favorites.web.dto.FavoriteRequest;
import com.assessment.favorites.web.dto.FavoriteResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST endpoints used by the React app ({@code features/favorites}).
 * CORS for localhost:5173 is configured in {@link com.assessment.favorites.config.WebConfig}.
 */
@RestController
@RequestMapping("/api/favorites")
public class FavoritePlaceController {

  private final FavoritePlaceService service;

  public FavoritePlaceController(FavoritePlaceService service) {
    this.service = service;
  }

  @GetMapping
  public List<FavoriteResponse> list() {
    return service.findAll();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public FavoriteResponse create(@Valid @RequestBody FavoriteRequest request) {
    return service.save(request);
  }

  @DeleteMapping("/{placeId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("placeId") String placeId) {
    service.deleteByPlaceId(placeId);
  }
}
