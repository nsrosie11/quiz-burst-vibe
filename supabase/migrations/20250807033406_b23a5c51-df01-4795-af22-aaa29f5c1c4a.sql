-- Create 6 levels for each existing category
DO $$
DECLARE
    cat_record RECORD;
    level_names TEXT[] := ARRAY['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    difficulties TEXT[] := ARRAY['easy', 'easy', 'medium', 'medium', 'hard', 'hard'];
    i INTEGER;
BEGIN
    -- Loop through each category
    FOR cat_record IN SELECT id FROM quiz_categories LOOP
        -- Create 6 levels for each category
        FOR i IN 1..6 LOOP
            INSERT INTO quiz_levels (
                category_id,
                level_number,
                name,
                difficulty,
                max_points,
                questions_count
            ) VALUES (
                cat_record.id,
                i,
                level_names[i],
                difficulties[i],
                100,
                5
            ) ON CONFLICT (category_id, level_number) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;