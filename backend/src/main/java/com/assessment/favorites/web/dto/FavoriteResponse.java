package com.assessment.favorites.web.dto;

import com.assessment.favorites.domain.FavoritePlace;
import java.time.Instant;

public class FavoriteResponse {

  private Long id;
  private String placeId;
  private String name;
  private String address;
  private Double lat;
  private Double lng;
  private Instant createdAt;

  public static FavoriteResponse from(FavoritePlace entity) {
    FavoriteResponse response = new FavoriteResponse();
    response.id = entity.getId();
    response.placeId = entity.getPlaceId();
    response.name = entity.getName();
    response.address = entity.getAddress();
    response.lat = entity.getLat();
    response.lng = entity.getLng();
    response.createdAt = entity.getCreatedAt();
    return response;
  }

  public Long getId() {
    return id;
  }

  public String getPlaceId() {
    return placeId;
  }

  public String getName() {
    return name;
  }

  public String getAddress() {
    return address;
  }

  public Double getLat() {
    return lat;
  }

  public Double getLng() {
    return lng;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
