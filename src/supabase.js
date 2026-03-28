import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://obqykiyklautfbflrjrq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icXlraXlrbGF1dGZiZmxyanJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzY1NjQsImV4cCI6MjA5MDIxMjU2NH0.SSIZMslapyPpd5cWoi_SMyLq7ikKErVld4w-GNTjJb8'
)

