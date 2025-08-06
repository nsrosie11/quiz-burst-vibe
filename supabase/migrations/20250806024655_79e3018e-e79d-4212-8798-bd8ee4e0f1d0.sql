-- Create the get_quiz_questions function to fetch questions
CREATE OR REPLACE FUNCTION get_quiz_questions(p_category_id text, p_level_id uuid DEFAULT NULL)
RETURNS TABLE(
    id uuid,
    question_text text,
    option_a text,
    option_b text,
    option_c text,
    option_d text,
    correct_answer integer
) AS $$
BEGIN
    -- For now, return mock questions since the actual questions table structure may need adjustment
    IF p_level_id IS NOT NULL THEN
        -- Return level-specific questions (mock data for now)
        RETURN QUERY SELECT 
            gen_random_uuid() as id,
            'What is 2 + 2?' as question_text,
            '3' as option_a,
            '4' as option_b,
            '5' as option_c,
            '6' as option_d,
            1 as correct_answer
        UNION ALL
        SELECT 
            gen_random_uuid() as id,
            'What is the capital of France?' as question_text,
            'London' as option_a,
            'Berlin' as option_b,
            'Paris' as option_c,
            'Madrid' as option_d,
            2 as correct_answer;
    ELSE
        -- Return category questions (mock data for now)
        RETURN QUERY SELECT 
            gen_random_uuid() as id,
            'What is 5 + 3?' as question_text,
            '7' as option_a,
            '8' as option_b,
            '9' as option_c,
            '10' as option_d,
            1 as correct_answer
        UNION ALL
        SELECT 
            gen_random_uuid() as id,
            'What is the largest planet?' as question_text,
            'Earth' as option_a,
            'Jupiter' as option_b,
            'Saturn' as option_c,
            'Mars' as option_d,
            1 as correct_answer;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;