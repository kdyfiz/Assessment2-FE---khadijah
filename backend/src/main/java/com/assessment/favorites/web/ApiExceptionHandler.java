package com.assessment.favorites.web;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(
      MethodArgumentNotValidException ex) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .map(
                err ->
                    (err.getField() != null ? err.getField() + ": " : "")
                        + (err.getDefaultMessage() != null
                            ? err.getDefaultMessage()
                            : "invalid"))
            .collect(Collectors.joining("; "));

    Map<String, Object> body = new HashMap<>();
    body.put("message", message.isBlank() ? "Validation failed" : message);
    body.put("status", HttpStatus.BAD_REQUEST.value());
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put(
        "message",
        ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString());
    body.put("status", ex.getStatusCode().value());
    return ResponseEntity.status(ex.getStatusCode()).body(body);
  }
}
