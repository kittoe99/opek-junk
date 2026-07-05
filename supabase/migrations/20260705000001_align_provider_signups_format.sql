-- Align existing provider_signups records from AI-agent format to frontend format
UPDATE public.provider_signups
SET provider_info = jsonb_build_object(
  'business_name', COALESCE(provider_info->'availability'->>'businessName', ''),
  'service_areas', CASE
    WHEN provider_info->>'service_area' IS NOT NULL
         AND provider_info->>'service_area' != ''
         AND provider_info->>'service_area' != 'N/A'
    THEN jsonb_build_array(
      jsonb_build_object(
        'state', NULLIF(TRIM(SPLIT_PART(provider_info->>'service_area', ', ', 2)), ''),
        'metroArea', NULLIF(TRIM(SPLIT_PART(provider_info->>'service_area', ', ', 1)), '')
      )
    )
    ELSE '[]'::jsonb
  END,
  'vehicle', CASE
    WHEN provider_info->>'vehicle_type' IS NOT NULL
         AND provider_info->>'vehicle_type' != ''
    THEN jsonb_build_object(
      'type', provider_info->>'vehicle_type',
      'year', '',
      'make', '',
      'model', '',
      'images', '[]'::jsonb,
      'insurance', '[]'::jsonb
    )
    ELSE '{}'::jsonb
  END,
  'availability', CASE
    WHEN provider_info->'availability'->>'schedule' IS NOT NULL
    THEN provider_info->'availability'->>'schedule'
    ELSE ''
  END,
  'additional_info', COALESCE(provider_info->'availability'->>'additionalInfo', ''),
  'conv_id', COALESCE(provider_info->'availability'->>'convId', '')
)
WHERE provider_info->>'service_area' IS NOT NULL
   OR provider_info->>'vehicle_type' IS NOT NULL;